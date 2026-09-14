import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { from, switchMap } from 'rxjs';

import { environment } from '../../environments/environment';

// Agrega el token manualmente en vez de depender del interceptor automatico de MSAL,
// que a veces no alcanza a tener la instancia lista y deja la peticion sin Authorization.
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.azure.api.url)) {
    return next(req);
  }

  const msalService = inject(MsalService);

  const tokenPromise = (async (): Promise<string | null> => {
    await msalService.instance.initialize();

    const account = msalService.instance.getActiveAccount();

    if (!account) {
      return null;
    }

    try {
      const result = await msalService.instance.acquireTokenSilent({
        scopes: [environment.azure.api.scope],
        account,
      });

      return result.accessToken;
    } catch {
      return null;
    }
  })();

  return from(tokenPromise).pipe(
    switchMap((token) => {
      const conRequest = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

      return next(conRequest);
    })
  );
};
