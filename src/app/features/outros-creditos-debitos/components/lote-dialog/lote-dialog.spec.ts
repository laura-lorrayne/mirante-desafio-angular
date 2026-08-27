import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lote, SituacaoLote } from '../../../../core/models/lote.model';

import { LoteDialog } from './lote-dialog';

describe('LoteDialog', () => {
  let component: LoteDialog;
  let fixture: ComponentFixture<LoteDialog>;

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
      imports: [LoteDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(LoteDialog);

    component = fixture.componentInstance;

    fixture.componentRef.setInput('lote', loteMock);
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve impedir valor igual a zero', () => {
    component.form.controls.valor.setValue(0);

    expect(component.form.controls.valor.hasError('min')).toBeTrue();
  });

  it('deve impedir quantidade negativa de lançamentos', () => {
    component.form.controls.quantidadeLancamentos.setValue(-1);

    expect(component.form.controls.quantidadeLancamentos.hasError('min')).toBeTrue();
  });

  it('não deve salvar formulário inválido', () => {
    spyOn(component.salvar, 'emit');

    component.form.patchValue({
      instituicaoResponsavel: '',
      instituicao: '',
      valor: null,
      quantidadeLancamentos: null,
    });

    component.onSalvar();

    expect(component.salvar.emit).not.toHaveBeenCalled();
  });

  it('deve emitir lote alterado quando formulário for válido', () => {
    spyOn(component.salvar, 'emit');

    component.form.patchValue({
      instituicaoResponsavel: 'Banco Central',

      instituicao: 'Instituição Alterada',

      valor: 99999.99,

      quantidadeLancamentos: 5,

      situacao: SituacaoLote.ENVIADO,
    });

    component.onSalvar();

    expect(component.salvar.emit).toHaveBeenCalled();

    const loteEmitido = (component.salvar.emit as jasmine.Spy).calls.mostRecent().args[0] as Lote;

    expect(loteEmitido.id).toBe(1001);

    expect(loteEmitido.instituicao).toBe('Instituição Alterada');

    expect(loteEmitido.valor).toBe(99999.99);

    expect(loteEmitido.quantidadeLancamentos).toBe(5);

    expect(loteEmitido.situacao).toBe(SituacaoLote.ENVIADO);
  });
});
