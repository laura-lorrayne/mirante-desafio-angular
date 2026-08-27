import { firstValueFrom } from 'rxjs';

import { LoteService } from './lote';

import { LoteFiltro } from '../models/lote-filtro.model';

import { SituacaoLote } from '../models/lote.model';

describe('LoteService', () => {
  let service: LoteService;

  const criarFiltroVazio = (): LoteFiltro => ({
    instituicaoResponsavel: null,
    instituicao: null,
    situacao: null,
    idLoteDe: null,
    idLoteAte: null,
    valorDe: null,
    valorAte: null,
    dataEntradaDe: null,
    dataEntradaAte: null,
  });

  beforeEach(() => {
    service = new LoteService();
  });

  it('deve retornar os lotes ao pesquisar sem filtros', async () => {
    const filtro = criarFiltroVazio();

    const resultado = await firstValueFrom(service.pesquisar(filtro));

    expect(resultado.length).toBeGreaterThan(0);
  });

  it('deve filtrar lotes pela situação', async () => {
    const filtro = criarFiltroVazio();

    filtro.situacao = SituacaoLote.ABERTO;

    const resultado = await firstValueFrom(service.pesquisar(filtro));

    expect(resultado.length).toBeGreaterThan(0);

    expect(resultado.every((lote) => lote.situacao === SituacaoLote.ABERTO)).toBeTrue();
  });

  it('deve pesquisar um lote por intervalo de ID', async () => {
    const filtro = criarFiltroVazio();

    filtro.idLoteDe = 1001;
    filtro.idLoteAte = 1001;

    const resultado = await firstValueFrom(service.pesquisar(filtro));

    expect(resultado.length).toBe(1);

    expect(resultado[0].id).toBe(1001);
  });

  it('deve atualizar a situação de um lote', async () => {
    const atualizados = await firstValueFrom(
      service.atualizarSituacao([1001], SituacaoLote.CONFIRMADO),
    );

    expect(atualizados.length).toBe(1);

    expect(atualizados[0].id).toBe(1001);

    expect(atualizados[0].situacao).toBe(SituacaoLote.CONFIRMADO);

    expect(atualizados[0].usuarioAprovacao).toBe('usuario.aprovador');
  });

  it('deve persistir a alteração de um lote em memória', async () => {
    const filtro = criarFiltroVazio();

    filtro.idLoteDe = 1001;
    filtro.idLoteAte = 1001;

    const resultadoInicial = await firstValueFrom(service.pesquisar(filtro));

    const lote = resultadoInicial[0];

    const alterado = {
      ...lote,
      valor: 99999.99,
      instituicao: 'Instituição Teste',
    };

    await firstValueFrom(service.atualizar(alterado));

    const resultadoDepois = await firstValueFrom(service.pesquisar(filtro));

    expect(resultadoDepois.length).toBe(1);

    expect(resultadoDepois[0].valor).toBe(99999.99);

    expect(resultadoDepois[0].instituicao).toBe('Instituição Teste');
  });

  it('deve excluir um lote e mantê-lo excluído em memória', async () => {
    await firstValueFrom(service.excluir(1001));

    const filtro = criarFiltroVazio();

    filtro.idLoteDe = 1001;
    filtro.idLoteAte = 1001;

    const resultado = await firstValueFrom(service.pesquisar(filtro));

    expect(resultado.length).toBe(0);
  });
});
