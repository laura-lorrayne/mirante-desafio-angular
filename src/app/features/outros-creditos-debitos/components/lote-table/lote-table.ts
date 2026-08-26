import { Component, input, output } from '@angular/core';

import { CurrencyPipe, DatePipe } from '@angular/common';

import { TableModule } from 'primeng/table';

import { Lote } from '../../../../core/models/lote.model';

@Component({
  selector: 'app-lote-table',
  imports: [TableModule, CurrencyPipe, DatePipe],
  templateUrl: './lote-table.html',
  styleUrl: './lote-table.scss',
})
export class LoteTable {
  readonly lotes = input.required<Lote[]>();

  readonly loading = input(false);

  readonly selecionados = input<Lote[]>([]);

  readonly selecaoAlterada = output<Lote[]>();

  onSelectionChange(lotes: Lote[]): void {
    this.selecaoAlterada.emit(lotes);
  }
}
