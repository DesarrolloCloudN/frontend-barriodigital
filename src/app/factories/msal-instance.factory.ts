import { PublicClientApplication } from '@azure/msal-browser';
import { environment } from '../../environments/environment';

// Crea la instancia de MSAL (la librería de Microsoft para el login) usando los datos de
// configuración de Azure que están en el archivo de environment.
export function MSALInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azure.clientId,
      authority: environment.azure.authority,
      redirectUri: environment.azure.redirectUri,
      postLogoutRedirectUri: environment.azure.redirectUri,
    },

    cache: {
      // Guarda los datos de sesión en sessionStorage (se borran al cerrar la pestaña).
      cacheLocation: 'sessionStorage',
    },
  });
}
