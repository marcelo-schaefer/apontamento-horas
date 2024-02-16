import { AbstractControl } from '@angular/forms';

export const regexNoWhiteSpacesOnly = /\S/;

export function campoObrigatorio(control: AbstractControl): boolean {
  if (!control) {
    return false;
  }

  if (control.validator) {
    const validator = control.validator({} as AbstractControl);

    if (validator && validator.required && control.enabled) {
      return true;
    }
  }

  return false;
}
