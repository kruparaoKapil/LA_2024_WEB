import { Pipe, PipeTransform } from '@angular/core';
import { indianGroup } from '../utils/indian-currency.util';

/**
 * Drop-in replacement for legacy `CurrencypipewithdecimalPipe`.
 * Forces 2 decimal places. Used as `{{ value | currencypipewithdecimal }}`.
 */
@Pipe({ name: 'currencypipewithdecimal', standalone: true, pure: true })
export class CurrencyWithDecimalPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    return indianGroup(value, true);
  }
}
