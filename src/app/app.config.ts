import { ApplicationConfig, inject, isDevMode, provideEnvironmentInitializer } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideTransloco, translocoConfig } from '@jsverse/transloco';
import { ConfirmationService, MessageService } from 'primeng/api';
import { appRoutes } from './app.routes';
import { API_PREFIX_INTERCEPTOR } from './core/interceptors/api-prefix.interceptor';
import { AUTH_INTERCEPTOR } from './core/interceptors/auth.interceptor';
import { API_URL } from './core/tokens/api-url.token';
import { environment } from '../environments/environment';
import { TranslocoHttpLoader } from './transloco/transloco-http.loader';
import { LocaleRouteService } from './core/services/locale-route.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideRouter(appRoutes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideHttpClient(withInterceptors([API_PREFIX_INTERCEPTOR, AUTH_INTERCEPTOR])),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark'
        }
      }
    }),
    provideTransloco({
      config: translocoConfig({
        availableLangs: ['en', 'ar'],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode()
      }),
      loader: TranslocoHttpLoader
    }),
    provideEnvironmentInitializer(() => {
      inject(LocaleRouteService);
    }),
    { provide: API_URL, useValue: environment.apiUrl },
    MessageService,
    ConfirmationService
  ]
};
