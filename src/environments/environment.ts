export const environment = {
  production: false,

  azure: {
    clientId: 'TODO-CONFIG', // Client ID del App Registration del SPA Angular
    tenantId: 'TODO-CONFIG', // Tenant ID de Microsoft Entra ID

    authority: 'TODO-CONFIG', // https://login.microsoftonline.com/<TENANT_ID>

    redirectUri: 'http://localhost:4200/',

    api: {
      clientId: 'TODO-CONFIG', // Client ID del App Registration del BFF

      scope: 'api://TODO-CONFIG/access_as_user',

      url: 'TODO-CONFIG', // URL de invocación del API Gateway (stage Desarrollo)
    },
  },
};