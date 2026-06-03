/**
 * Shared types + helpers for FI-Individual list-of-rows sub-forms.
 *
 * The legacy API consumes a per-row `ptypeofoperation` lifecycle flag
 * (`CREATE | UPDATE | DELETE | OLD`) so the back-end can apply only the
 * deltas. Every list sub-form (bank, kyc, family, property, movable
 * property, co-applicant, nominee) implements the same pattern; the
 * helpers here keep the per-component code straightforward.
 */
export type ListRowOperation = 'CREATE' | 'UPDATE' | 'DELETE' | 'OLD';

export interface ListRow {
  ptypeofoperation: ListRowOperation;
  [key: string]: unknown;
}

/** Marks an existing row dirty for the back-end. */
export function markDirty<T extends ListRow>(row: T): T {
  if (row.ptypeofoperation === 'CREATE') return row;
  return { ...row, ptypeofoperation: 'UPDATE' };
}

/** Returns the rows that should be sent to the API (drops un-persisted CREATEs we then deleted). */
export function filterVisible<T extends ListRow>(rows: T[]): T[] {
  return rows.filter((r) => r.ptypeofoperation !== 'DELETE');
}

/** Soft-delete (or hard-drop if not yet persisted) a row. */
export function deleteRow<T extends ListRow>(rows: T[], target: T): T[] {
  return rows
    .map((r) => {
      if (r !== target) return r;
      if (r.ptypeofoperation === 'CREATE') {
        return null as unknown as T;
      }
      return { ...r, ptypeofoperation: 'DELETE' as ListRowOperation };
    })
    .filter((r) => r !== null) as T[];
}

/** Tag rows loaded from the server with `OLD` so subsequent edits flip them to UPDATE. */
export function asOldRows<T extends Record<string, unknown>>(
  rows: T[] | null | undefined,
): (T & ListRow)[] {
  return (rows ?? []).map((r) => ({
    ...r,
    ptypeofoperation: 'OLD' as ListRowOperation,
  })) as (T & ListRow)[];
}
