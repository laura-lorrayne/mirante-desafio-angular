import { Component, computed, DestroyRef, inject, signal } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { finalize } from 'rxjs';

import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

import { BreadcrumbModule } from 'primeng/breadcrumb';

import { ButtonModule } from 'primeng/button';

import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ToastModule } from 'primeng/toast';

import { Lote, SituacaoLote } from '../../../../core/models/lote.model';

import { LoteFiltro } from '../../../../core/models/lote-filtro.model';

import { LoteService } from '../../../../core/services/lote';

import { LoteFiltros } from '../../components/lote-filtros/lote-filtros';

import { LoteTable } from '../../components/lote-table/lote-table';

import { LancamentoDialog } from '../../components/lancamento-dialog/lancamento-dialog';

import { LoteDialog, ModoLoteDialog } from '../../components/lote-dialog/lote-dialog';

@Component({
  selector: 'app-consulta-lotes',

  imports: [
    BreadcrumbModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    LoteFiltros,
    LoteTable,
    LancamentoDialog,
    LoteDialog,
  ],

  providers: [MessageService, ConfirmationService],

  templateUrl: './consulta-lotes.html',
  styleUrl: './consulta-lotes.scss',
})
export class ConsultaLotes {
  private readonly loteService = inject(LoteService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly messageService = inject(MessageService);

  private readonly confirmationService = inject(ConfirmationService);

  readonly lotes = signal<Lote[]>([]);

  readonly lotesSelecionados = signal<Lote[]>([]);

  readonly loading = signal(false);

  readonly erro = signal<string | null>(null);

  readonly pesquisou = signal(false);

  readonly modalLancamentoVisivel = signal(false);

  readonly loteDialogVisivel = signal(false);

  readonly loteDialogModo = signal<ModoLoteDialog>('visualizar');

  readonly loteDialogSelecionado = signal<Lote | null>(null);

  readonly possuiSelecionados = computed(() => this.lotesSelecionados().length > 0);

  readonly possuiUmSelecionado = computed(() => this.lotesSelecionados().length === 1);

  readonly home: MenuItem = {
    icon: 'pi pi-home',
  };

  readonly breadcrumbItems: MenuItem[] = [
    {
      label: 'Outros Créditos/Débitos',
    },
  ];

  onPesquisar(filtro: LoteFiltro): void {
    this.loading.set(true);

    this.erro.set(null);

    this.pesquisou.set(true);

    this.lotesSelecionados.set([]);

    this.loteService
      .pesquisar(filtro)
      .pipe(
        takeUntilDestroyed(this.destroyRef),

        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (lotes) => {
          this.lotes.set(lotes);
        },

        error: () => {
          this.lotes.set([]);

          this.erro.set('Não foi possível realizar a pesquisa dos lotes.');

          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível consultar os lotes.',
          });
        },
      });
  }

  onSelecaoAlterada(lotes: Lote[]): void {
    this.lotesSelecionados.set(lotes);
  }

  onConfirmar(): void {
    const selecionados = this.lotesSelecionados();

    if (!selecionados.length) {
      return;
    }

    const ids = selecionados.map((lote) => lote.id);

    this.loading.set(true);

    this.loteService
      .atualizarSituacao(ids, SituacaoLote.CONFIRMADO)
      .pipe(
        takeUntilDestroyed(this.destroyRef),

        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (atualizados) => {
          this.aplicarAtualizacoes(atualizados);

          this.lotesSelecionados.set([]);

          this.messageService.add({
            severity: 'success',
            summary: 'Lotes confirmados',
            detail: `${atualizados.length} lote(s) confirmado(s) com sucesso.`,
          });
        },

        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível confirmar os lotes selecionados.',
          });
        },
      });
  }

  onEnviar(): void {
    const selecionados = this.lotesSelecionados();

    if (!selecionados.length) {
      return;
    }

    const ids = selecionados.map((lote) => lote.id);

    this.loading.set(true);

    this.loteService
      .atualizarSituacao(ids, SituacaoLote.ENVIADO)
      .pipe(
        takeUntilDestroyed(this.destroyRef),

        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (atualizados) => {
          this.aplicarAtualizacoes(atualizados);

          this.lotesSelecionados.set([]);

          this.messageService.add({
            severity: 'success',
            summary: 'Lotes enviados',
            detail: `${atualizados.length} lote(s) enviado(s) com sucesso.`,
          });
        },

        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível enviar os lotes selecionados.',
          });
        },
      });
  }

  onVisualizarJustificativa(): void {
    const selecionados = this.lotesSelecionados();

    if (!selecionados.length) {
      return;
    }

    const ids = selecionados.map((lote) => lote.id).join(', ');

    this.messageService.add({
      severity: 'info',
      summary: 'Justificativa',
      detail: `Nenhuma justificativa registrada para o(s) lote(s): ${ids}.`,
    });
  }

  onIncluir(): void {
    this.modalLancamentoVisivel.set(true);
  }

  onAlterar(): void {
    const lote = this.lotesSelecionados()[0];

    if (!lote) {
      return;
    }

    this.loteDialogSelecionado.set(lote);

    this.loteDialogModo.set('alterar');

    this.loteDialogVisivel.set(true);
  }

  onVisualizar(): void {
    const lote = this.lotesSelecionados()[0];

    if (!lote) {
      return;
    }

    this.loteDialogSelecionado.set(lote);

    this.loteDialogModo.set('visualizar');

    this.loteDialogVisivel.set(true);
  }

  onSalvarLoteAlterado(loteAtualizado: Lote): void {
    this.loading.set(true);

    this.loteService
      .atualizar(loteAtualizado)
      .pipe(
        takeUntilDestroyed(this.destroyRef),

        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (atualizado) => {
          this.lotes.update((lotes) =>
            lotes.map((lote) => (lote.id === atualizado.id ? atualizado : lote)),
          );

          this.lotesSelecionados.set([atualizado]);

          this.loteDialogSelecionado.set(atualizado);

          this.loteDialogVisivel.set(false);

          this.messageService.add({
            severity: 'success',
            summary: 'Lote alterado',
            detail: `O lote ${atualizado.id} foi alterado com sucesso.`,
          });
        },

        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Não foi possível alterar o lote ${loteAtualizado.id}.`,
          });
        },
      });
  }

  onExcluir(): void {
    const lote = this.lotesSelecionados()[0];

    if (!lote) {
      return;
    }

    this.confirmationService.confirm({
      header: 'Excluir lote',

      message: `Deseja realmente excluir o lote ${lote.id}?`,

      icon: 'pi pi-exclamation-triangle',

      acceptLabel: 'Excluir',

      rejectLabel: 'Cancelar',

      accept: () => {
        this.loading.set(true);

        this.loteService
          .excluir(lote.id)
          .pipe(
            takeUntilDestroyed(this.destroyRef),

            finalize(() => {
              this.loading.set(false);
            }),
          )
          .subscribe({
            next: () => {
              this.lotes.update((lotes) => lotes.filter((item) => item.id !== lote.id));

              this.lotesSelecionados.set([]);

              this.messageService.add({
                severity: 'success',
                summary: 'Lote excluído',
                detail: `O lote ${lote.id} foi excluído com sucesso.`,
              });
            },

            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: `Não foi possível excluir o lote ${lote.id}.`,
              });
            },
          });
      },
    });
  }

  private aplicarAtualizacoes(atualizados: Lote[]): void {
    this.lotes.update((lotes) =>
      lotes.map((lote) => {
        const atualizado = atualizados.find((item) => item.id === lote.id);

        return atualizado ?? lote;
      }),
    );
  }
}
