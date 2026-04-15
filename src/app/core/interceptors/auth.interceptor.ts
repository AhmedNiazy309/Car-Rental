import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';

export const AUTH_INTERCEPTOR: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);
  const transloco = inject(TranslocoService);

  const token = auth.getToken();

  let cloned = req;
  if (token) {
    cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
  } else {
    cloned = req.clone({
      setHeaders: {
        Accept: 'application/json'
      }
    });
  }

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.clearAuth();
        router.navigate(['/login']);
        messageService.add({
          severity: 'error',
          summary: transloco.translate('auth.sessionExpired'),
          detail: transloco.translate('auth.loginAgain'),
          life: 4000
        });
      } else if (error.status === 403) {
        messageService.add({
          severity: 'warn',
          summary: 'Access Denied',
          detail: error.error?.message || 'You do not have permission to access this resource.',
          life: 4000
        });
      } else if (error.status === 404) {
        messageService.add({
          severity: 'error',
          summary: 'Not Found',
          detail: error.error?.message || 'The requested resource was not found.',
          life: 4000
        });
      } else if (error.status === 500) {
        messageService.add({
          severity: 'error',
          summary: transloco.translate('messages.error'),
          detail: transloco.translate('messages.serverError'),
          life: 5000
        });
      } else if (error.status === 0) {
        messageService.add({
          severity: 'error',
          summary: transloco.translate('messages.error'),
          detail: transloco.translate('messages.connectionError'),
          life: 5000
        });
      }
      // 422 errors are handled by form components individually
      return throwError(() => error);
    })
  );
};
