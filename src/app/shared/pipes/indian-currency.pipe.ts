import { Pipe, PipeTransform } from '@angular/core';
import { indianGroup } from '../utils/indian-currency.util';

/**
 * Drop-in replacement for legacy `MycurrencypipePipe` (`mycurrencypipe`).
 * Used as `{{ value | mycurrencypipe }}` in dozens of templates.
 */
@Pipe({ name: 'mycurrencypipe', standalone: true, pure: true })
export class IndianCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    return indianGroup(value, false);
  }
}
