import { Component, computed, input, output, signal } from '@angular/core';

import { CurrencyPipe, DatePipe } from '@angular/common';

import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';

import { Lote } from '../../../../core/models/lote.model';

@Component({
  selector: 'app-lote-table',
  imports: [TableModule, PaginatorModule, SkeletonModule, CurrencyPipe, DatePipe],
  templateUrl: './lote-table.html',
  styleUrl: './lote-table.scss',
})
export class LoteTable {
  readonly lotes = input.required<Lote[]>();
  readonly loading = input(false);

  readonly selecaoAlterada = output<Lote[]>();

  readonly selecionados = signal<Lote[]>([]);

  readonly first = signal(0);
  readonly rows = signal(5);

  readonly firstValido = computed(() => {
    const total = this.lotes().length;
    const rows = this.rows();

    if (total === 0) {
      return 0;
    }

    const ultimaPagina = Math.floor((total - 1) / rows) * rows;

    return Math.min(this.first(), ultimaPagina);
  });

  readonly lotesPaginados = computed(() => {
    const inicio = this.firstValido();
    const fim = inicio + this.rows();

    return this.lotes().slice(inicio, fim);
  });

  onSelectionChange(lotes: Lote[]): void {
    this.selecionados.set(lotes);
    this.selecaoAlterada.emit(lotes);
  }

  onPageChange(event: PaginatorState): void {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 5);
  }
}
