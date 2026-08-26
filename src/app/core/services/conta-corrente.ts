import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { ContaCorrente } from '../models/conta-corrente.model';
import { CONTAS_CORRENTES_MOCK } from '../mocks/contas-correntes.mock';

@Injectable({
  providedIn: 'root',
})
export class ContaCorrenteService {
  buscarPorNumero(numero: string): Observable<ContaCorrente | null> {
    const conta = CONTAS_CORRENTES_MOCK.find((item) => item.numero === numero.trim()) ?? null;

    return of(conta).pipe(delay(400));
  }
}
