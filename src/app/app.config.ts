import {
  ApplicationConfig,
  LOCALE_ID,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MessageService, ConfirmationService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en-IN';

import { routes } from './app.routes';
import { branchContextInterceptor } from './core/interceptors/branch-context.interceptor';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AppConfigService } from './core/config/app-config.service';

registerLocaleData(localeEn, 'en-IN');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(
      withFetch(),
      withInterceptors([branchContextInterceptor, jwtInterceptor, errorInterceptor]),
    ),
    provideAppInitializer(() => inject(AppConfigService).load()),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
      ripple: true,
      inputVariant: 'outlined',
    }),
    MessageService,
    ConfirmationService,
    { provide: LOCALE_ID, useValue: 'en-IN' },
  ],
};
