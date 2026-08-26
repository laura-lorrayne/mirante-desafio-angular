import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';

import { SituacaoLote } from '../../../../core/models/lote.model';

import { LoteFiltro } from '../../../../core/models/lote-filtro.model';

import { rangeValidator } from '../../../../shared/validators/range.validator';

interface SituacaoOption {
  label: string;
  value: SituacaoLote | null;
}

@Component({
  selector: 'app-lote-filtros',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DatePickerModule,
    InputNumberModule,
    InputTextModule,
    PanelModule,
    SelectModule,
  ],
  templateUrl: './lote-filtros.html',
  styleUrl: './lote-filtros.scss',
})
export class LoteFiltros {
  private readonly fb = inject(FormBuilder);

  readonly pesquisar = output<LoteFiltro>();

  readonly situacoes: SituacaoOption[] = [
    {
      label: 'Todas',
      value: null,
    },
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

  readonly form = this.fb.group(
    {
      instituicaoResponsavel: [''],
      instituicao: [''],
      situacao: [null as SituacaoLote | null],

      idLoteDe: [null as number | null],
      idLoteAte: [null as number | null],

      valorDe: [null as number | null],
      valorAte: [null as number | null],

      dataEntradaDe: [null as Date | null],
      dataEntradaAte: [null as Date | null],
    },
    {
      validators: [
        rangeValidator('idLoteDe', 'idLoteAte', 'idLoteRange'),
        rangeValidator('valorDe', 'valorAte', 'valorRange'),
        rangeValidator('dataEntradaDe', 'dataEntradaAte', 'dataRange'),
      ],
    },
  );

  onPesquisar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valor = this.form.getRawValue();

    const filtro: LoteFiltro = {
      instituicaoResponsavel: valor.instituicaoResponsavel?.trim() || null,

      instituicao: valor.instituicao?.trim() || null,

      situacao: valor.situacao,

      idLoteDe: valor.idLoteDe,
      idLoteAte: valor.idLoteAte,

      valorDe: valor.valorDe,
      valorAte: valor.valorAte,

      dataEntradaDe: valor.dataEntradaDe,
      dataEntradaAte: valor.dataEntradaAte,
    };

    this.pesquisar.emit(filtro);
  }
}
