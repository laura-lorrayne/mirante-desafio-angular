import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lote, SituacaoLote } from '../../../../core/models/lote.model';

import { LoteTable } from './lote-table';

describe('LoteTable', () => {
  let component: LoteTable;
  let fixture: ComponentFixture<LoteTable>;

  const loteMock: Lote = {
    id: 1001,

    instituicaoResponsavel: 'Banco Central',

    instituicao: 'Instituição Alpha',

    dataEntrada: new Date('2026-08-01T09:30:00'),

    valor: 12500.5,

    quantidadeLancamentos: 3,

    usuarioRegistro: 'maria.silva',

    usuarioAprovacao: null,

    situacao: SituacaoLote.ABERTO,

    dataHoraSituacao: new Date('2026-08-01T09:30:00'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteTable],
    }).compileComponents();

    fixture = TestBed.createComponent(LoteTable);

    component = fixture.componentInstance;

    fixture.componentRef.setInput('lotes', [loteMock]);

    fixture.componentRef.setInput('selecionados', []);

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve receber a lista de lotes', () => {
    expect(component.lotes().length).toBe(1);

    expect(component.lotes()[0].id).toBe(1001);
  });

  it('deve emitir alteração de seleção', () => {
    spyOn(component.selecaoAlterada, 'emit');

    component.onSelectionChange([loteMock]);

    expect(component.selecaoAlterada.emit).toHaveBeenCalledWith([loteMock]);
  });

  it('deve emitir seleção vazia ao desmarcar os lotes', () => {
    spyOn(component.selecaoAlterada, 'emit');

    component.onSelectionChange([]);

    expect(component.selecaoAlterada.emit).toHaveBeenCalledWith([]);
  });

  it('deve respeitar o estado de loading recebido', () => {
    fixture.componentRef.setInput('loading', true);

    fixture.detectChanges();

    expect(component.loading()).toBeTrue();
  });
});
