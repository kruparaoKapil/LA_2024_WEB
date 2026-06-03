import { Pipe, PipeTransform } from '@angular/core';
import { indianGroup } from '../utils/indian-currency.util';

/**
 * Replacement for legacy `NegativevaluePipe` (`negativevalue`).
 *
 * Original behaviour: zero or negative values are wrapped in parentheses
 * around the absolute formatted value; positives are formatted as-is.
 * Original delegated to `CommonService.currencyformat`; here we use the
 * shared {@link indianGroup} helper directly.
 */
@Pipe({ name: 'negativevalue', standalone: true, pure: true })
export class NegativeValuePipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '';
    const num = Number(value);
    if (Number.isNaN(num)) return '';
    if (num <= 0) return '(' + indianGroup(Math.abs(num), true) + ')';
    return indianGroup(num, true);
  }
}
