import { PublicClientApplication } from '@azure/msal-browser';
import { environment } from '../../environments/environment';

// Crea la instancia de MSAL usando la configuración de Azure del environment.
export function MSALInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azure.clientId,
      authority: environment.azure.authority,
      // Se usa el origin actual para que funcione tanto en localhost como en la IP de la EC2.
      redirectUri: window.location.origin + '/',
      postLogoutRedirectUri: window.location.origin + '/',
    },

    cache: {
      // Guarda los datos de sesión en sessionStorage (se borran al cerrar la pestaña).
      cacheLocation: 'sessionStorage',
    },
  });
}
