export enum SituacaoLote {
  ABERTO = 'Aberto',
  ENVIADO = 'Enviado',
  CONFIRMADO = 'Confirmado',
}

export interface Lote {
  id: number;
  instituicaoResponsavel: string;
  instituicao: string;
  dataEntrada: Date;
  valor: number;
  quantidadeLancamentos: number;
  usuarioRegistro: string;
  usuarioAprovacao: string | null;
  situacao: SituacaoLote;
  dataHoraSituacao: Date;
}
