import { Component, computed, DestroyRef, inject, signal } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

import { Lote } from '../../../../core/models/lote.model';
import { LoteFiltro } from '../../../../core/models/lote-filtro.model';
import { LoteService } from '../../../../core/services/lote';

import { LoteFiltros } from '../../components/lote-filtros/lote-filtros';
import { LoteTable } from '../../components/lote-table/lote-table';
import { LancamentoDialog } from '../../components/lancamento-dialog/lancamento-dialog';

@Component({
  selector: 'app-consulta-lotes',
  imports: [BreadcrumbModule, ButtonModule, LoteFiltros, LoteTable, LancamentoDialog],
  templateUrl: './consulta-lotes.html',
  styleUrl: './consulta-lotes.scss',
})
export class ConsultaLotes {
  private readonly loteService = inject(LoteService);
  private readonly destroyRef = inject(DestroyRef);

  readonly lotes = signal<Lote[]>([]);
  readonly lotesSelecionados = signal<Lote[]>([]);

  readonly loading = signal(false);
  readonly erro = signal<string | null>(null);
  readonly pesquisou = signal(false);
  readonly modalLancamentoVisivel = signal(false);

  readonly possuiSelecionados = computed(() => this.lotesSelecionados().length > 0);

  readonly possuiUmSelecionado = computed(() => this.lotesSelecionados().length === 1);

  readonly breadcrumbItems: MenuItem[] = [
    {
      label: 'Outros Créditos/Débitos',
    },
  ];

  readonly home: MenuItem = {
    icon: 'pi pi-home',
    label: 'Início',
  };

  onPesquisar(filtro: LoteFiltro): void {
    this.loading.set(true);
    this.erro.set(null);
    this.pesquisou.set(true);
    this.lotesSelecionados.set([]);

    this.loteService
      .pesquisar(filtro)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (lotes) => {
          this.lotes.set(lotes);
        },

        error: () => {
          this.lotes.set([]);

          this.erro.set('Não foi possível realizar a pesquisa. Tente novamente.');
        },
      });
  }

  onSelecaoAlterada(lotes: Lote[]): void {
    this.lotesSelecionados.set(lotes);
  }

  onConfirmar(): void {
    console.log('Confirmar lotes:', this.lotesSelecionados());
  }

  onEnviar(): void {
    console.log('Enviar lotes:', this.lotesSelecionados());
  }

  onVisualizarJustificativa(): void {
    console.log('Visualizar justificativa:', this.lotesSelecionados());
  }

  onIncluir(): void {
    this.modalLancamentoVisivel.set(true);
  }
  onAlterar(): void {
    const lote = this.lotesSelecionados()[0];

    console.log('Alterar lote:', lote);
  }

  onExcluir(): void {
    const lote = this.lotesSelecionados()[0];

    console.log('Excluir lote:', lote);
  }

  onVisualizar(): void {
    const lote = this.lotesSelecionados()[0];

    console.log('Visualizar lote:', lote);
  }
}
