import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthStore } from '../auth/auth.store';

/**
 * Legacy `CommonService.callPostAPI` / `callGetAPI` always send
 * `X-Database-Name: <SetBranch.pbranch_name>` when a branch is selected.
 * Without this header the API returns 401 on `/login` and other calls.
 */
export const branchContextInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(AuthStore);
  const branch = store.branch();
  const branchName =
    (branch?.pbranch_name as string | undefined) ??
    (branch?.pBranchName as string | undefined) ??
    readBranchNameFromStorage();

  if (!branchName) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        'X-Database-Name': branchName,
        'Cache-Control': 'no-cache',
      },
    }),
  );
};

function readBranchNameFromStorage(): string | null {
  try {
    const raw = sessionStorage.getItem('SetBranch') ?? localStorage.getItem('SetBranch');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { pbranch_name?: string; pBranchName?: string };
    return parsed.pbranch_name ?? parsed.pBranchName ?? null;
  } catch {
    return null;
  }
}
