import { FormControl, FormGroup } from '@angular/forms';

import { rangeValidator } from './range.validator';

describe('rangeValidator', () => {
  it('deve retornar null quando o intervalo for válido', () => {
    const form = new FormGroup(
      {
        de: new FormControl(10),
        ate: new FormControl(20),
      },
      {
        validators: rangeValidator('de', 'ate', 'intervaloInvalido'),
      },
    );

    expect(form.errors).toBeNull();
  });

  it('deve retornar erro quando o valor inicial for maior que o final', () => {
    const form = new FormGroup(
      {
        de: new FormControl(30),
        ate: new FormControl(20),
      },
      {
        validators: rangeValidator('de', 'ate', 'intervaloInvalido'),
      },
    );

    expect(form.hasError('intervaloInvalido')).toBeTrue();
  });

  it('deve aceitar valores iguais', () => {
    const form = new FormGroup(
      {
        de: new FormControl(20),
        ate: new FormControl(20),
      },
      {
        validators: rangeValidator('de', 'ate', 'intervaloInvalido'),
      },
    );

    expect(form.errors).toBeNull();
  });

  it('não deve validar o intervalo quando o campo inicial estiver vazio', () => {
    const form = new FormGroup(
      {
        de: new FormControl(null),
        ate: new FormControl(20),
      },
      {
        validators: rangeValidator('de', 'ate', 'intervaloInvalido'),
      },
    );

    expect(form.errors).toBeNull();
  });

  it('não deve validar o intervalo quando o campo final estiver vazio', () => {
    const form = new FormGroup(
      {
        de: new FormControl(10),
        ate: new FormControl(null),
      },
      {
        validators: rangeValidator('de', 'ate', 'intervaloInvalido'),
      },
    );

    expect(form.errors).toBeNull();
  });
});
