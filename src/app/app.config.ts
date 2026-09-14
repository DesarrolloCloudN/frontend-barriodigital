import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService,
  MsalGuard,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalService,
} from '@azure/msal-angular';

import { InteractionType } from '@azure/msal-browser';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { MSALInstanceFactory } from './factories/msal-instance.factory';
import { environment } from '../environments/environment';

// Le dice al interceptor de MSAL a qué URLs debe agregarles el token automáticamente.
const msalInterceptorConfig: MsalInterceptorConfiguration = {
  interactionType: InteractionType.Redirect,

  protectedResourceMap: new Map([
    [`${environment.azure.api.url}/api/requests`, [environment.azure.api.scope]],
    [`${environment.azure.api.url}/api/catalog`, [environment.azure.api.scope]],
  ]),
};

// Configuración principal de la app: rutas, cliente HTTP y login con MSAL.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideHttpClient(withInterceptorsFromDi()),

    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
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

    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useValue: msalInterceptorConfig,
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },

    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
};
