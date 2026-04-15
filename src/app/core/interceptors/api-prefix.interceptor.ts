import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL } from '../tokens/api-url.token';

export const API_PREFIX_INTERCEPTOR: HttpInterceptorFn = (req, next) => {
  const apiUrl = inject(API_URL);

  if (/^https?:\/\//.test(req.url)) {
    return next(req);
  }

  const normalized = req.url.startsWith('/') ? req.url : `/${req.url}`;

  // تخطي ملفات الترجمة والملفات الثابتة
  if (normalized.startsWith('/i18n/') || normalized.startsWith('/assets/')) {
    return next(req);
  }

  return next(req.clone({ url: `${apiUrl}${normalized}` }));
};
