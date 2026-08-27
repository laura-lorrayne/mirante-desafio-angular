import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { Lote, SituacaoLote } from '../models/lote.model';

import { LoteFiltro } from '../models/lote-filtro.model';
import { LOTES_MOCK } from '../mocks/lotes.mock';

@Injectable({
  providedIn: 'root',
})
export class LoteService {
  private lotes: Lote[] = [...LOTES_MOCK];

  pesquisar(filtro: LoteFiltro): Observable<Lote[]> {
    const resultado = this.lotes.filter((lote) => this.atendeFiltros(lote, filtro));

    return of(resultado).pipe(delay(100));
  }

  atualizarSituacao(ids: number[], situacao: SituacaoLote): Observable<Lote[]> {
    const agora = new Date();

    this.lotes = this.lotes.map((lote) =>
      ids.includes(lote.id)
        ? {
            ...lote,
            situacao,
            dataHoraSituacao: agora,
            usuarioAprovacao:
              situacao === SituacaoLote.CONFIRMADO ? 'usuario.aprovador' : lote.usuarioAprovacao,
          }
        : lote,
    );

    const atualizados = this.lotes.filter((lote) => ids.includes(lote.id));

    return of(atualizados).pipe(delay(100));
  }

  excluir(id: number): Observable<void> {
    this.lotes = this.lotes.filter((lote) => lote.id !== id);

    return of(undefined).pipe(delay(100));
  }

  atualizar(loteAtualizado: Lote): Observable<Lote> {
    this.lotes = this.lotes.map((lote) =>
      lote.id === loteAtualizado.id
        ? {
            ...loteAtualizado,
          }
        : lote,
    );

    const atualizado = this.lotes.find((lote) => lote.id === loteAtualizado.id);

    if (!atualizado) {
      throw new Error(`Lote ${loteAtualizado.id} não encontrado.`);
    }

    return of(atualizado).pipe(delay(100));
  }

  private atendeFiltros(lote: Lote, filtro: LoteFiltro): boolean {
    if (
      filtro.instituicaoResponsavel &&
      !this.contemTexto(lote.instituicaoResponsavel, filtro.instituicaoResponsavel)
    ) {
      return false;
    }

    if (filtro.instituicao && !this.contemTexto(lote.instituicao, filtro.instituicao)) {
      return false;
    }

    if (filtro.situacao && lote.situacao !== filtro.situacao) {
      return false;
    }

    if (filtro.idLoteDe !== null && lote.id < filtro.idLoteDe) {
      return false;
    }

    if (filtro.idLoteAte !== null && lote.id > filtro.idLoteAte) {
      return false;
    }

    if (filtro.valorDe !== null && lote.valor < filtro.valorDe) {
      return false;
    }

    if (filtro.valorAte !== null && lote.valor > filtro.valorAte) {
      return false;
    }

    if (filtro.dataEntradaDe && lote.dataEntrada < this.inicioDoDia(filtro.dataEntradaDe)) {
      return false;
    }

    if (filtro.dataEntradaAte && lote.dataEntrada > this.fimDoDia(filtro.dataEntradaAte)) {
      return false;
    }

    return true;
  }

  private contemTexto(valor: string, pesquisa: string): boolean {
    return valor.toLocaleLowerCase('pt-BR').includes(pesquisa.trim().toLocaleLowerCase('pt-BR'));
  }

  private inicioDoDia(data: Date): Date {
    const inicio = new Date(data);

    inicio.setHours(0, 0, 0, 0);

    return inicio;
  }

  private fimDoDia(data: Date): Date {
    const fim = new Date(data);

    fim.setHours(23, 59, 59, 999);

    return fim;
  }
}
