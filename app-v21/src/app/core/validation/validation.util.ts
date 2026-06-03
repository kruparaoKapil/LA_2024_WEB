import { AbstractControl } from '@angular/forms';

/**
 * Pure replacement for `CommonService.getValidationMessage`.
 *
 * Behaviour preserved verbatim so existing template usages render the same
 * error strings:
 *   - 'required'   → '<lablename> Required'
 *   - 'email' / 'pattern' → 'Invalid <lablename>'
 *   - 'minlength'  → '<lablename> Must Have <n> Digits'
 *   - 'maxlength' (key !== skipKey)  → '<lablename> Must Have <n> Digits'
 *   - 'maxlength' (key === skipKey)  → 'Invalid <lablename>'
 */
export function getValidationMessage(
  control: AbstractControl,
  errorKey: string,
  labelName: string,
  key: string,
  skipKey: string,
): string {
  if (errorKey === 'required') return `${labelName} Required`;
  if (errorKey === 'email' || errorKey === 'pattern') return `Invalid ${labelName}`;
  if (errorKey === 'minlength') {
    const length = control.errors?.['minlength']?.requiredLength;
    return `${labelName} Must Have ${length} Digits`;
  }
  if (errorKey === 'maxlength') {
    if (key !== skipKey) {
      const length = control.errors?.['maxlength']?.requiredLength;
      return `${labelName} Must Have ${length} Digits`;
    }
    return `Invalid ${labelName}`;
  }
  return `${labelName} is invalid`;
}
