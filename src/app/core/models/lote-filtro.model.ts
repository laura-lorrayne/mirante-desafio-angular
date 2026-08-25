import { SituacaoLote } from './lote.model';

export interface LoteFiltro {
  instituicaoResponsavel: string | null;
  instituicao: string | null;
  situacao: SituacaoLote | null;

  idLoteDe: number | null;
  idLoteAte: number | null;

  valorDe: number | null;
  valorAte: number | null;

  dataEntradaDe: Date | null;
  dataEntradaAte: Date | null;
}
