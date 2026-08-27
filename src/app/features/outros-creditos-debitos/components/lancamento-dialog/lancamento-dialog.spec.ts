import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LancamentoDialog } from './lancamento-dialog';

describe('LancamentoDialog', () => {
  let component: LancamentoDialog;
  let fixture: ComponentFixture<LancamentoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LancamentoDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(LancamentoDialog);

    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com o formulário inválido', () => {
    expect(component.form.invalid).toBeTrue();

    expect(component.form.controls.contaCorrente.hasError('required')).toBeTrue();

    expect(component.form.controls.valor.hasError('required')).toBeTrue();

    expect(component.form.controls.historico.hasError('required')).toBeTrue();

    expect(component.form.controls.documento.hasError('required')).toBeTrue();
  });

  it('deve rejeitar valor igual a zero', () => {
    component.form.controls.valor.setValue(0);

    expect(component.form.controls.valor.hasError('min')).toBeTrue();
  });

  it('não deve incluir lançamento sem conta corrente validada', () => {
    component.form.patchValue({
      contaCorrente: '99999-9',
      valor: 150,
      historico: 'Lançamento Manual',
      documento: 'DOC-001',
    });

    component.salvar();

    expect(component.lancamentos().length).toBe(0);

    expect(component.contaNaoEncontrada()).toBeTrue();
  });

  it('deve incluir um lançamento válido em memória', () => {
    component.form.patchValue({
      contaCorrente: '10001-1',
      titular: 'João da Silva',
      valor: 150,
      historico: 'Lançamento Manual',
      estorno: false,
      documento: 'DOC-001',
      descricao: 'Lançamento de teste',
      pa: '01',
    });

    component.salvar();

    const lancamentos = component.lancamentos();

    expect(lancamentos.length).toBe(1);

    expect(lancamentos[0].id).toBe(1);

    expect(lancamentos[0].contaCorrente).toBe('10001-1');

    expect(lancamentos[0].titular).toBe('João da Silva');

    expect(lancamentos[0].valor).toBe(150);

    expect(lancamentos[0].historico).toBe('Lançamento Manual');

    expect(lancamentos[0].documento).toBe('DOC-001');

    expect(lancamentos[0].situacao).toBe('Pendente');
  });

  it('deve preparar a duplicação sem copiar o documento', () => {
    component.form.patchValue({
      contaCorrente: '10001-1',
      titular: 'João da Silva',
      valor: 200,
      historico: 'Ajuste Contábil',
      estorno: false,
      documento: 'DOC-ORIGINAL',
      descricao: 'Teste de duplicação',
      pa: '02',
    });

    component.salvar();

    const original = component.lancamentos()[0];

    component.onLancamentoSelecionado(original);

    component.duplicarLancamento();

    const valores = component.form.getRawValue();

    expect(component.modoFormulario()).toBe('novo');

    expect(component.lancamentoSelecionado()).toBeNull();

    expect(valores.contaCorrente).toBe('10001-1');

    expect(valores.valor).toBe(200);

    expect(valores.documento).toBe('');
  });
});
