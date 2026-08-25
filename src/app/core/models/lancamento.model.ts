export type SituacaoLancamento = 'Pendente';

export interface Lancamento {
  id: number;
  contaCorrente: string;
  titular: string;
  valor: number;
  historico: string;
  estorno: boolean;
  documento: string;
  descricao: string | null;
  situacao: SituacaoLancamento;
  pa: string | null;
}
