import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorService } from './services/custompaginator.service';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { register as registerSwiperElements } from 'swiper/element/bundle';
import { provideNativeDateAdapter } from '@angular/material/core';

registerSwiperElements();
registerLocaleData(localePt);
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: MatPaginatorIntl, useClass: CustomPaginatorService },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideNativeDateAdapter()
  ],
};
