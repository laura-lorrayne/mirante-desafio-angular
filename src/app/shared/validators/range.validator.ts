import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function rangeValidator(campoDe: string, campoAte: string, errorKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valorDe = control.get(campoDe)?.value;
    const valorAte = control.get(campoAte)?.value;

    if (valorDe === null || valorDe === undefined || valorAte === null || valorAte === undefined) {
      return null;
    }

    return valorDe <= valorAte ? null : { [errorKey]: true };
  };
}
