import { afterNextRender, Component, DestroyRef, inject, Injector, signal } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

import { Lote } from '../../../../core/models/lote.model';
import { LoteFiltro } from '../../../../core/models/lote-filtro.model';
import { LoteService } from '../../../../core/services/lote';

import { LoteFiltros } from '../../components/lote-filtros/lote-filtros';
import { LoteTable } from '../../components/lote-table/lote-table';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-consulta-lotes',
  imports: [BreadcrumbModule, LoteFiltros, LoteTable],
  templateUrl: './consulta-lotes.html',
  styleUrl: './consulta-lotes.scss',
})
export class ConsultaLotes {
  private readonly loteService = inject(LoteService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  readonly lotes = signal<Lote[]>([]);
  readonly lotesSelecionados = signal<Lote[]>([]);

  readonly loading = signal(false);
  readonly erro = signal<string | null>(null);
  readonly pesquisou = signal(false);

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

  private finalizarLoadingAposRenderizacao(): void {
    afterNextRender(
      {
        read: () => {
          this.loading.set(false);
        },
      },
      {
        injector: this.injector,
      },
    );
  }
}
