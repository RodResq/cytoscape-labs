import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(ReactiveFormsModule),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura, // Tema padrão (Aura, Material, Lara, Nora)
        options: {
          prefix: 'p',
          darkModeSelector: false, // 'system', 'class', false
          cssLayer: false
        }
      },
      ripple: true, // Efeito de ondulação nos botões
      inputVariant: 'outlined', // 'outlined' ou 'filled'
      zIndex: {
        modal: 1100,    // dialog, sidebar
        overlay: 1000,  // dropdown, overlaypanel
        menu: 1000,     // overlay menus
        tooltip: 1100   // tooltip
      },
      csp: {
        nonce: undefined // Para Content Security Policy se necessário
      }
    }),
  ]
};
