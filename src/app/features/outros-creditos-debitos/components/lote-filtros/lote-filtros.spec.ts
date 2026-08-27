import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { SituacaoLote } from '../../../../core/models/lote.model';

import { LoteFiltros } from './lote-filtros';

describe('LoteFiltros', () => {
  let component: LoteFiltros;
  let fixture: ComponentFixture<LoteFiltros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteFiltros],

      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoteFiltros);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com formulário válido', () => {
    expect(component.form.valid).toBeTrue();
  });

  it('deve considerar inválido quando ID inicial for maior que ID final', () => {
    component.form.patchValue({
      idLoteDe: 2000,
      idLoteAte: 1000,
    });

    component.form.updateValueAndValidity();

    expect(component.form.invalid).toBeTrue();
  });

  it('deve considerar inválido quando valor inicial for maior que valor final', () => {
    component.form.patchValue({
      valorDe: 5000,
      valorAte: 1000,
    });

    component.form.updateValueAndValidity();

    expect(component.form.invalid).toBeTrue();
  });

  it('deve considerar inválido quando data inicial for maior que data final', () => {
    component.form.patchValue({
      dataEntradaDe: new Date('2026-08-20'),

      dataEntradaAte: new Date('2026-08-10'),
    });

    component.form.updateValueAndValidity();

    expect(component.form.invalid).toBeTrue();
  });

  it('deve emitir os filtros quando formulário for válido', () => {
    spyOn(component.pesquisar, 'emit');

    component.form.patchValue({
      instituicaoResponsavel: 'Banco Central',

      instituicao: 'Instituição Alpha',

      situacao: SituacaoLote.ABERTO,

      idLoteDe: 1001,

      idLoteAte: 1010,
    });

    component.onPesquisar();

    expect(component.pesquisar.emit).toHaveBeenCalled();

    const filtroEmitido = (component.pesquisar.emit as jasmine.Spy).calls.mostRecent().args[0];

    expect(filtroEmitido.instituicaoResponsavel).toBe('Banco Central');

    expect(filtroEmitido.instituicao).toBe('Instituição Alpha');

    expect(filtroEmitido.situacao).toBe(SituacaoLote.ABERTO);
  });

  it('não deve emitir pesquisa quando formulário for inválido', () => {
    spyOn(component.pesquisar, 'emit');

    component.form.patchValue({
      idLoteDe: 2000,
      idLoteAte: 1000,
    });

    component.onPesquisar();

    expect(component.pesquisar.emit).not.toHaveBeenCalled();
  });
});
