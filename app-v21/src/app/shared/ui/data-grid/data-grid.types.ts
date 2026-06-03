import type { TemplateRef } from '@angular/core';

export type DataGridColumnAlign = 'left' | 'center' | 'right';

export interface DataGridColumn<TRow = Record<string, unknown>> {
  /** Property name on the row object. Dot-paths supported (`a.b`). */
  field: string;
  /** Header label rendered above the column. */
  header: string;
  /** Sortable via clicking header. Defaults to true for non-template columns. */
  sortable?: boolean;
  /** Filter input above column body. Defaults to false. */
  filter?: boolean;
  filterMatchMode?: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'gt' | 'lt';
  /** Right-align numeric columns, etc. */
  align?: DataGridColumnAlign;
  /** Explicit column width (CSS), e.g. `'120px'` or `'10%'`. */
  width?: string;
  /** Hide from toolbar export. */
  excludeFromExport?: boolean;
  /** Custom cell template, takes `{ $implicit: row, value }`. */
  cellTemplate?: TemplateRef<{ $implicit: TRow; value: unknown }>;
  /** Optional formatter applied when no `cellTemplate` is provided. */
  format?: (value: unknown, row: TRow) => string;
}

export interface DataGridSelectionEvent<TRow> {
  selected: TRow[];
}
