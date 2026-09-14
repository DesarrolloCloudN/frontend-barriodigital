import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MsalBroadcastService,
  MsalGuard,
  MsalService,
} from '@azure/msal-angular';

import { InteractionType } from '@azure/msal-browser';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { MSALInstanceFactory } from './factories/msal-instance.factory';
import { authTokenInterceptor } from './interceptors/auth-token.interceptor';

// MSAL exige inicializar la instancia antes de usarla (login, tokens, interceptor).
// Con APP_INITIALIZER, Angular espera esto antes de activar rutas o componentes.
function initializeMsal(msalService: MsalService) {
  return () => msalService.instance.initialize();
}

// Configuración principal de la app: rutas, cliente HTTP y login con MSAL.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideHttpClient(withInterceptors([authTokenInterceptor])),

    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },

    {
      provide: APP_INITIALIZER,
      useFactory: initializeMsal,
      deps: [MsalService],
      multi: true,
    },

    // Configuración del guard de MSAL: qué scopes pedir al iniciar sesión.
    {
      provide: MSAL_GUARD_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['openid', 'profile'],
        },
      },
    },

    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
};
