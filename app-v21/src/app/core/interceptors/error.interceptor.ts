import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const messages = inject(MessageService, { optional: true });

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const status = err.status;
      const message = err.error?.message ?? err.message ?? 'Request failed';

      if (status === 401) {
        router.navigate(['/Login']);
      }

      messages?.add({
        severity: status >= 500 ? 'error' : 'warn',
        summary: status >= 500 ? 'Server error' : 'Request failed',
        detail: message,
        life: 5000,
      });

      return throwError(() => err);
    }),
  );
};
