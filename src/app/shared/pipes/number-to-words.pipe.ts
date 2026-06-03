import { Pipe, PipeTransform } from '@angular/core';

/**
 * Indian-format number-to-words: groups in 9 digits matched as
 * `(crore)(lakh)(thousand)(hundred)(tens)`. Decimal portion (paisa) handled
 * separately. Behaviour preserved verbatim from legacy `NumberToWordsPipe`.
 */
@Pipe({ name: 'numberToWords', standalone: true, pure: true })
export class NumberToWordsPipe implements PipeTransform {
  private readonly a = [
    '',
    'One ',
    'Two ',
    'Three ',
    'Four ',
    'Five ',
    'Six ',
    'Seven ',
    'Eight ',
    'Nine ',
    'Ten ',
    'Eleven ',
    'Twelve ',
    'Thirteen ',
    'Fourteen ',
    'Fifteen ',
    'Sixteen ',
    'Seventeen ',
    'Eighteen ',
    'Nineteen ',
  ];

  private readonly b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '';

    const raw = String(value);
    let intPart = raw;
    let decimalPart = '';

    if (raw.includes('.')) {
      const [whole, dec] = raw.split('.');
      intPart = whole;
      decimalPart = dec;
    }

    let decistr = '';
    if (decimalPart && decimalPart !== '00' && decimalPart !== '0' && decimalPart !== '') {
      const padded = ('000000000' + decimalPart).slice(-9);
      const n = padded.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (n) {
        decistr += this.crore(n[1]);
        decistr += this.lakh(n[1] === '00' ? n[2] : n[2], 'lakh');
        decistr += this.thousand(n[3]);
        decistr += this.hundred(n[4]);
        decistr += Number(n[5]) !== 0
          ? ((decistr !== '' ? 'and ' : '') + (this.a[Number(n[5])] || this.b[Number(n[5][0])] + ' ' + this.a[Number(n[5][1])]))
          : '';
        if (decistr) decistr += 'paisa ';
      }
    }

    let str = '';
    if (intPart && intPart !== '0') {
      const padded = ('000000000' + intPart).slice(-9);
      const n = padded.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return '';

      str += Number(n[1]) !== 0
        ? (this.a[Number(n[1])] || this.b[Number(n[1][0])] + ' ' + this.a[Number(n[1][1])]) + 'Crore '
        : '';
      str += Number(n[2]) !== 0
        ? (this.a[Number(n[2])] || this.b[Number(n[2][0])] + ' ' + this.a[Number(n[2][1])]) + 'Lakh '
        : '';
      str += Number(n[3]) !== 0
        ? (this.a[Number(n[3])] || this.b[Number(n[3][0])] + ' ' + this.a[Number(n[3][1])]) + 'Thousand '
        : '';
      str += Number(n[4]) !== 0
        ? (this.a[Number(n[4])] || this.b[Number(n[4][0])] + ' ' + this.a[Number(n[4][1])]) + 'hundred '
        : '';

      if (!decistr) {
        str += Number(n[5]) !== 0
          ? ((str !== '' ? 'and ' : '') + (this.a[Number(n[5])] || this.b[Number(n[5][0])] + ' ' + this.a[Number(n[5][1])]))
          : '';
        return str;
      }

      str += Number(n[5]) !== 0
        ? ((str !== '' ? ' ' : '') + (this.a[Number(n[5])] || this.b[Number(n[5][0])] + ' ' + this.a[Number(n[5][1])]))
        : '';
      return str + ' and ' + decistr;
    }

    return decistr;
  }

  private crore(s: string): string {
    return Number(s) !== 0
      ? (this.a[Number(s)] || this.b[Number(s[0])] + ' ' + this.a[Number(s[1])]) + 'crore '
      : '';
  }
  private lakh(s: string, suffix: string): string {
    return Number(s) !== 0
      ? (this.a[Number(s)] || this.b[Number(s[0])] + ' ' + this.a[Number(s[1])]) + suffix + ' '
      : '';
  }
  private thousand(s: string): string {
    return Number(s) !== 0
      ? (this.a[Number(s)] || this.b[Number(s[0])] + ' ' + this.a[Number(s[1])]) + 'thousand '
      : '';
  }
  private hundred(s: string): string {
    return Number(s) !== 0
      ? (this.a[Number(s)] || this.b[Number(s[0])] + ' ' + this.a[Number(s[1])]) + 'hundred '
      : '';
  }
}
