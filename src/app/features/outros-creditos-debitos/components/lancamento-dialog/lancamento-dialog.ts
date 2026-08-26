import { CurrencyPipe } from '@angular/common';

import { Component, computed, DestroyRef, inject, input, output, signal } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { finalize } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';

import { Lancamento } from '../../../../core/models/lancamento.model';
import { ContaCorrenteService } from '../../../../core/services/conta-corrente';

interface SelectOption {
  label: string;
  value: string;
}

type ModoFormulario = 'novo' | 'edicao' | 'visualizacao';

@Component({
  selector: 'app-lancamento-dialog',
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TextareaModule,
  ],
  templateUrl: './lancamento-dialog.html',
  styleUrl: './lancamento-dialog.scss',
})
export class LancamentoDialog {
  private readonly fb = inject(FormBuilder);

  private readonly contaCorrenteService = inject(ContaCorrenteService);

  private readonly destroyRef = inject(DestroyRef);

  readonly visible = input(false);
  readonly visibleChange = output<boolean>();

  readonly loadingConta = signal(false);
  readonly contaNaoEncontrada = signal(false);

  readonly lancamentos = signal<Lancamento[]>([]);

  readonly lancamentoSelecionado = signal<Lancamento | null>(null);

  readonly modoFormulario = signal<ModoFormulario>('novo');

  readonly possuiLancamentoSelecionado = computed(() => this.lancamentoSelecionado() !== null);

  private proximoId = 1;

  readonly historicos: SelectOption[] = [
    {
      label: 'Lançamento Manual',
      value: 'Lançamento Manual',
    },
    {
      label: 'Ajuste Contábil',
      value: 'Ajuste Contábil',
    },
    {
      label: 'Regularização',
      value: 'Regularização',
    },
  ];

  readonly pas: SelectOption[] = [
    {
      label: 'PA 01',
      value: '01',
    },
    {
      label: 'PA 02',
      value: '02',
    },
    {
      label: 'PA 03',
      value: '03',
    },
  ];

  readonly form = this.fb.group({
    contaCorrente: ['', Validators.required],

    titular: [
      {
        value: '',
        disabled: true,
      },
    ],

    valor: [null as number | null, [Validators.required, Validators.min(0.01)]],

    historico: [null as string | null, Validators.required],

    estorno: [false],

    documento: ['', Validators.required],

    descricao: [''],

    situacao: [
      {
        value: 'Pendente',
        disabled: true,
      },
    ],

    pa: [null as string | null],
  });

  onVisibleChange(visible: boolean): void {
    this.visibleChange.emit(visible);
  }

  fechar(): void {
    this.visibleChange.emit(false);
  }

  onContaAlterada(): void {
    this.form.controls.titular.setValue('');

    this.contaNaoEncontrada.set(false);
  }

  buscarConta(): void {
    const numero = this.form.controls.contaCorrente.value?.trim();

    if (!numero) {
      this.form.controls.contaCorrente.markAsTouched();

      return;
    }

    this.loadingConta.set(true);
    this.contaNaoEncontrada.set(false);

    this.form.controls.titular.setValue('');

    this.contaCorrenteService
      .buscarPorNumero(numero)
      .pipe(
        takeUntilDestroyed(this.destroyRef),

        finalize(() => {
          this.loadingConta.set(false);
        }),
      )
      .subscribe({
        next: (conta) => {
          if (!conta) {
            this.contaNaoEncontrada.set(true);

            return;
          }

          this.form.controls.titular.setValue(conta.titular);
        },

        error: () => {
          this.contaNaoEncontrada.set(true);
        },
      });
  }

  onLancamentoSelecionado(lancamento: Lancamento | null): void {
    this.lancamentoSelecionado.set(lancamento);
  }

  prepararInclusao(): void {
    this.habilitarFormulario();

    this.modoFormulario.set('novo');

    this.lancamentoSelecionado.set(null);

    this.limparFormulario();
  }

  visualizarLancamento(): void {
    const lancamento = this.lancamentoSelecionado();

    if (!lancamento) {
      return;
    }

    this.habilitarFormulario();

    this.preencherFormulario(lancamento);

    this.form.disable({
      emitEvent: false,
    });

    this.modoFormulario.set('visualizacao');
  }

  prepararAlteracao(): void {
    const lancamento = this.lancamentoSelecionado();

    if (!lancamento) {
      return;
    }

    this.habilitarFormulario();

    this.preencherFormulario(lancamento);

    this.modoFormulario.set('edicao');
  }

  excluirLancamento(): void {
    const lancamento = this.lancamentoSelecionado();

    if (!lancamento) {
      return;
    }

    this.lancamentos.update((lancamentos) =>
      lancamentos.filter((item) => item.id !== lancamento.id),
    );

    this.prepararInclusao();
  }

  duplicarLancamento(): void {
    const lancamento = this.lancamentoSelecionado();

    if (!lancamento) {
      return;
    }

    this.habilitarFormulario();

    this.modoFormulario.set('novo');

    this.lancamentoSelecionado.set(null);

    this.form.reset({
      contaCorrente: lancamento.contaCorrente,
      titular: lancamento.titular,
      valor: lancamento.valor,
      historico: lancamento.historico,
      estorno: lancamento.estorno,

      // Documento fica vazio para evitar
      // duplicação acidental do identificador.
      documento: '',

      descricao: lancamento.descricao ?? '',
      situacao: 'Pendente',
      pa: lancamento.pa,
    });

    this.contaNaoEncontrada.set(false);
  }

  salvar(): void {
    if (this.modoFormulario() === 'visualizacao') {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const titular = this.form.controls.titular.value;

    if (!titular) {
      this.contaNaoEncontrada.set(true);

      return;
    }

    if (this.modoFormulario() === 'edicao') {
      this.salvarAlteracao();

      return;
    }

    this.salvarInclusao();
  }

  private salvarInclusao(): void {
    const lancamento = this.criarLancamento(this.proximoId++);

    this.lancamentos.update((lancamentos) => [...lancamentos, lancamento]);

    this.prepararInclusao();
  }

  private salvarAlteracao(): void {
    const selecionado = this.lancamentoSelecionado();

    if (!selecionado) {
      return;
    }

    const atualizado = this.criarLancamento(selecionado.id);

    this.lancamentos.update((lancamentos) =>
      lancamentos.map((item) => (item.id === selecionado.id ? atualizado : item)),
    );

    this.lancamentoSelecionado.set(atualizado);

    this.preencherFormulario(atualizado);

    this.modoFormulario.set('visualizacao');

    this.form.disable({
      emitEvent: false,
    });
  }

  private criarLancamento(id: number): Lancamento {
    const valor = this.form.getRawValue();

    return {
      id,

      contaCorrente: valor.contaCorrente?.trim() ?? '',

      titular: valor.titular ?? '',

      valor: valor.valor ?? 0,

      historico: valor.historico ?? '',

      estorno: valor.estorno ?? false,

      documento: valor.documento?.trim() ?? '',

      descricao: valor.descricao?.trim() || null,

      situacao: 'Pendente',

      pa: valor.pa ?? null,
    };
  }

  private preencherFormulario(lancamento: Lancamento): void {
    this.form.reset({
      contaCorrente: lancamento.contaCorrente,
      titular: lancamento.titular,
      valor: lancamento.valor,
      historico: lancamento.historico,
      estorno: lancamento.estorno,
      documento: lancamento.documento,
      descricao: lancamento.descricao ?? '',
      situacao: lancamento.situacao,
      pa: lancamento.pa,
    });

    this.contaNaoEncontrada.set(false);
  }

  private habilitarFormulario(): void {
    this.form.enable({
      emitEvent: false,
    });

    this.form.controls.titular.disable({
      emitEvent: false,
    });

    this.form.controls.situacao.disable({
      emitEvent: false,
    });
  }

  private limparFormulario(): void {
    this.form.reset({
      contaCorrente: '',
      titular: '',
      valor: null,
      historico: null,
      estorno: false,
      documento: '',
      descricao: '',
      situacao: 'Pendente',
      pa: null,
    });

    this.contaNaoEncontrada.set(false);
  }
}
