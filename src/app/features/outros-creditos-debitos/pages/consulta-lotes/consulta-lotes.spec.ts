import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { Lote, SituacaoLote } from '../../../../core/models/lote.model';

import { LoteFiltro } from '../../../../core/models/lote-filtro.model';

import { LoteService } from '../../../../core/services/lote';

import { ConsultaLotes } from './consulta-lotes';

describe('ConsultaLotes', () => {
  let component: ConsultaLotes;
  let fixture: ComponentFixture<ConsultaLotes>;

  let loteService: jasmine.SpyObj<LoteService>;

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

  const filtroVazio: LoteFiltro = {
    instituicaoResponsavel: null,

    instituicao: null,

    situacao: null,

    idLoteDe: null,

    idLoteAte: null,

    valorDe: null,

    valorAte: null,

    dataEntradaDe: null,

    dataEntradaAte: null,
  };

  beforeEach(async () => {
    loteService = jasmine.createSpyObj<LoteService>('LoteService', [
      'pesquisar',
      'atualizarSituacao',
      'excluir',
      'atualizar',
    ]);

    loteService.pesquisar.and.returnValue(of([loteMock]));

    loteService.atualizarSituacao.and.returnValue(of([loteMock]));

    loteService.excluir.and.returnValue(of(undefined));

    loteService.atualizar.and.returnValue(of(loteMock));

    await TestBed.configureTestingModule({
      imports: [ConsultaLotes],

      providers: [
        {
          provide: LoteService,

          useValue: loteService,
        },

        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaLotes);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve pesquisar lotes', () => {
    component.onPesquisar(filtroVazio);

    expect(loteService.pesquisar).toHaveBeenCalledWith(filtroVazio);

    expect(component.pesquisou()).toBeTrue();

    expect(component.lotes().length).toBe(1);

    expect(component.lotes()[0].id).toBe(1001);
  });

  it('deve atualizar a seleção dos lotes', () => {
    component.onSelecaoAlterada([loteMock]);

    expect(component.lotesSelecionados().length).toBe(1);

    expect(component.possuiSelecionados()).toBeTrue();

    expect(component.possuiUmSelecionado()).toBeTrue();
  });

  it('deve considerar múltiplos lotes selecionados', () => {
    const segundoLote: Lote = {
      ...loteMock,
      id: 1002,
    };

    component.onSelecaoAlterada([loteMock, segundoLote]);

    expect(component.possuiSelecionados()).toBeTrue();

    expect(component.possuiUmSelecionado()).toBeFalse();
  });

  it('deve abrir modal de inclusão', () => {
    component.onIncluir();

    expect(component.modalLancamentoVisivel()).toBeTrue();
  });

  it('deve abrir lote em modo de visualização', () => {
    component.onSelecaoAlterada([loteMock]);

    component.onVisualizar();

    expect(component.loteDialogVisivel()).toBeTrue();

    expect(component.loteDialogModo()).toBe('visualizar');

    expect(component.loteDialogSelecionado()?.id).toBe(1001);
  });

  it('deve abrir lote em modo de alteração', () => {
    component.onSelecaoAlterada([loteMock]);

    component.onAlterar();

    expect(component.loteDialogVisivel()).toBeTrue();

    expect(component.loteDialogModo()).toBe('alterar');

    expect(component.loteDialogSelecionado()?.id).toBe(1001);
  });

  it('deve enviar lotes selecionados', () => {
    component.onSelecaoAlterada([loteMock]);

    const enviado: Lote = {
      ...loteMock,

      situacao: SituacaoLote.ENVIADO,
    };

    loteService.atualizarSituacao.and.returnValue(of([enviado]));

    component.onEnviar();

    expect(loteService.atualizarSituacao).toHaveBeenCalledWith([1001], SituacaoLote.ENVIADO);

    expect(component.lotesSelecionados().length).toBe(0);
  });

  it('deve confirmar lotes selecionados', () => {
    component.onSelecaoAlterada([loteMock]);

    const confirmado: Lote = {
      ...loteMock,

      situacao: SituacaoLote.CONFIRMADO,

      usuarioAprovacao: 'usuario.aprovador',
    };

    loteService.atualizarSituacao.and.returnValue(of([confirmado]));

    component.onConfirmar();

    expect(loteService.atualizarSituacao).toHaveBeenCalledWith([1001], SituacaoLote.CONFIRMADO);

    expect(component.lotesSelecionados().length).toBe(0);
  });

  it('deve salvar alteração do lote pelo service', () => {
    component.lotes.set([loteMock]);

    const alterado: Lote = {
      ...loteMock,

      instituicao: 'Instituição Alterada',

      valor: 99999.99,
    };

    loteService.atualizar.and.returnValue(of(alterado));

    component.onSalvarLoteAlterado(alterado);

    expect(loteService.atualizar).toHaveBeenCalledWith(alterado);

    expect(component.lotes()[0].instituicao).toBe('Instituição Alterada');

    expect(component.lotes()[0].valor).toBe(99999.99);

    expect(component.loteDialogVisivel()).toBeFalse();
  });
});
