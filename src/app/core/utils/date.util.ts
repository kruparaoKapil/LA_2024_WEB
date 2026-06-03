import { formatDate } from '@angular/common';

/**
 * Date helpers ported from the legacy `CommonService`.
 *
 * Legacy method names are preserved for grep-ability but internals are
 * rewritten to be pure (no `this.day`/`this.month`/`this.year` shared mutable
 * state) and locale-stable using `Intl` semantics via Angular's `formatDate`.
 */

const splitDateString = (raw: unknown): string[] | null => {
  if (typeof raw !== 'string' || raw.length < 8) return null;
  const trimmed = raw.substring(0, 10);
  if (trimmed.includes('/')) return trimmed.split('/');
  if (trimmed.includes('-')) return trimmed.split('-');
  if (trimmed.includes(' ')) return trimmed.split(' ');
  return null;
};

const buildDate = (y: number, m: number, d: number): Date | null => {
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
  return new Date(y, m - 1, d);
};

export const formatDateFromDDMMYYYY = (value: unknown): Date | null => {
  const parts = splitDateString(value);
  if (!parts) return null;
  return buildDate(Number(parts[2]), Number(parts[1]), Number(parts[0]));
};

export const formatDateFromYYYYMMDD = (value: unknown): Date | null => {
  const parts = splitDateString(value);
  if (!parts) return null;
  return buildDate(Number(parts[0]), Number(parts[1]), Number(parts[2]));
};

export const formatDateFromMMDDYYYY = (value: unknown): Date | null => {
  const parts = splitDateString(value);
  if (!parts) return null;
  return buildDate(Number(parts[2]), Number(parts[0]), Number(parts[1]));
};

/** dd/MM/yyyy in en-IN locale, the default visual format for the app. */
export const getFormatDate = (date: unknown, locale = 'en-IN'): string => {
  if (date == null || date === '') return '';
  return formatDate(date as string | number | Date, 'dd/MM/yyyy', locale);
};

export const getFormatDateTime = (date: unknown, locale = 'en-IN'): string => {
  if (date == null || date === '') return '';
  return formatDate(date as string | number | Date, 'dd/MM/yyyy HH:mm', locale);
};
