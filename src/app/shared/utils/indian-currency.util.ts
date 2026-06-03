/**
 * Indian-style number grouping (lakhs / crores) preserved verbatim from
 * legacy `MycurrencypipePipe.transform`.
 *
 * Example: 1234567.89 → "12,34,567.89"
 *
 * Keeping the legacy regex `/\B(?=(\d{2})+(?!\d))/g` semantics intact so
 * existing reports/receipts render with identical character-for-character
 * output; that's the visual contract that bank receipts depend on.
 */
export function indianGroup(value: number | string | null | undefined, withDecimals = false): string {
  if (value === null || value === undefined || value === '') return '';

  let raw = value;
  if (raw === 0 || raw === '0') return withDecimals ? '0.00' : '0';

  let str = String(raw);
  if (withDecimals && !str.includes('.')) {
    const fixed = (Math.round(Number(raw) * 100) / 100).toFixed(2);
    str = String(fixed);
  }

  const parts = str.split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  if (otherNumbers !== '' && otherNumbers !== '-' && otherNumbers !== '(') {
    lastThree = ',' + lastThree;
  }
  let output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  if (parts.length > 1) {
    if (withDecimals) {
      const dec = parts[1];
      output += '.' + (dec.length === 1 ? dec + '0' : dec.substring(0, 2));
    } else {
      output += '.' + parts[1];
    }
  }
  return output;
}
