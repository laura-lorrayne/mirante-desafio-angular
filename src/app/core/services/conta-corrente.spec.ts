import { firstValueFrom } from 'rxjs';

import { ContaCorrenteService } from './conta-corrente';

describe('ContaCorrenteService', () => {
  let service: ContaCorrenteService;

  beforeEach(() => {
    service = new ContaCorrenteService();
  });

  it('deve retornar a conta corrente quando o número existir', async () => {
    const resultado = await firstValueFrom(service.buscarPorNumero('10001-1'));

    expect(resultado).not.toBeNull();

    expect(resultado?.numero).toBe('10001-1');

    expect(resultado?.titular).toBe('João da Silva');
  });

  it('deve retornar null quando a conta corrente não existir', async () => {
    const resultado = await firstValueFrom(service.buscarPorNumero('99999-9'));

    expect(resultado).toBeNull();
  });

  it('deve ignorar espaços antes e depois do número da conta', async () => {
    const resultado = await firstValueFrom(service.buscarPorNumero('   10002-2   '));

    expect(resultado).not.toBeNull();

    expect(resultado?.numero).toBe('10002-2');

    expect(resultado?.titular).toBe('Maria Oliveira');
  });

  it('deve retornar null para uma string vazia', async () => {
    const resultado = await firstValueFrom(service.buscarPorNumero(''));

    expect(resultado).toBeNull();
  });

  it('deve retornar null quando forem informados apenas espaços', async () => {
    const resultado = await firstValueFrom(service.buscarPorNumero('     '));

    expect(resultado).toBeNull();
  });
});
