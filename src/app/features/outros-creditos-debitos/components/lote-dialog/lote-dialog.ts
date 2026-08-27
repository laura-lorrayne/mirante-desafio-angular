import { Component, effect, inject, input, output } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { Lote, SituacaoLote } from '../../../../core/models/lote.model';

export type ModoLoteDialog = 'visualizar' | 'alterar';

@Component({
  selector: 'app-lote-dialog',

  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
  ],

  templateUrl: './lote-dialog.html',
  styleUrl: './lote-dialog.scss',
})
export class LoteDialog {
  private readonly fb = inject(FormBuilder);

  readonly visible = input(false);

  readonly visibleChange = output<boolean>();

  readonly lote = input<Lote | null>(null);

  readonly modo = input<ModoLoteDialog>('visualizar');

  readonly salvar = output<Lote>();

  readonly situacoes = [
    {
      label: 'Aberto',
      value: SituacaoLote.ABERTO,
    },
    {
      label: 'Enviado',
      value: SituacaoLote.ENVIADO,
    },
    {
      label: 'Confirmado',
      value: SituacaoLote.CONFIRMADO,
    },
  ];

  readonly form = this.fb.group({
    id: [
      {
        value: null as number | null,
        disabled: true,
      },
    ],

    instituicaoResponsavel: ['', Validators.required],

    instituicao: ['', Validators.required],

    valor: [null as number | null, [Validators.required, Validators.min(0.01)]],

    quantidadeLancamentos: [null as number | null, [Validators.required, Validators.min(0)]],

    usuarioRegistro: [
      {
        value: '',
        disabled: true,
      },
    ],

    usuarioAprovacao: [
      {
        value: '',
        disabled: true,
      },
    ],

    situacao: [null as SituacaoLote | null, Validators.required],
  });

  constructor() {
    effect(() => {
      const lote = this.lote();

      const visible = this.visible();

      const modo = this.modo();

      if (!lote || !visible) {
        return;
      }

      this.preencherFormulario(lote);

      if (modo === 'visualizar') {
        this.form.disable({
          emitEvent: false,
        });

        return;
      }

      this.habilitarEdicao();
    });
  }

  get titulo(): string {
    return this.modo() === 'visualizar' ? 'Visualizar Lote' : 'Alterar Lote';
  }

  onVisibleChange(visible: boolean): void {
    this.visibleChange.emit(visible);
  }

  fechar(): void {
    this.visibleChange.emit(false);
  }

  onSalvar(): void {
    const loteOriginal = this.lote();

    if (!loteOriginal) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const dados = this.form.getRawValue();

    const atualizado: Lote = {
      ...loteOriginal,

      instituicaoResponsavel: dados.instituicaoResponsavel?.trim() ?? '',

      instituicao: dados.instituicao?.trim() ?? '',

      valor: dados.valor ?? 0,

      quantidadeLancamentos: dados.quantidadeLancamentos ?? 0,

      situacao: dados.situacao ?? loteOriginal.situacao,

      dataHoraSituacao: new Date(),
    };

    this.salvar.emit(atualizado);
  }

  private preencherFormulario(lote: Lote): void {
    this.form.reset({
      id: lote.id,

      instituicaoResponsavel: lote.instituicaoResponsavel,

      instituicao: lote.instituicao,

      valor: lote.valor,

      quantidadeLancamentos: lote.quantidadeLancamentos,

      usuarioRegistro: lote.usuarioRegistro,

      usuarioAprovacao: lote.usuarioAprovacao ?? '',

      situacao: lote.situacao,
    });
  }

  private habilitarEdicao(): void {
    this.form.enable({
      emitEvent: false,
    });

    this.form.controls.id.disable({
      emitEvent: false,
    });

    this.form.controls.usuarioRegistro.disable({
      emitEvent: false,
    });

    this.form.controls.usuarioAprovacao.disable({
      emitEvent: false,
    });
  }
}
