import {
  ApplicationConfig,
  LOCALE_ID,
  provideZoneChangeDetection,
  APP_INITIALIZER, // Importe APP_INITIALIZER
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorService } from './services/custompaginator.service';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { register as registerSwiperElements } from 'swiper/element/bundle';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  KeycloakBearerInterceptor,
  KeycloakService,
  provideKeycloak,
} from 'keycloak-angular';

registerSwiperElements();
registerLocaleData(localePt);

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8180',
        realm: 'quarkus',
        clientId: 'backend-service',
      },

      initOptions: {
        onLoad: 'check-sso',
        flow: 'standard',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        scope: 'openid email profile roles',
      },

    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: MatPaginatorIntl, useClass: CustomPaginatorService },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideNativeDateAdapter(),
    KeycloakService,
    
    {
      provide: APP_INITIALIZER, // Adicione APP_INITIALIZER
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
    },
  ],
};