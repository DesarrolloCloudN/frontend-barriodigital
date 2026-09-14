export const environment = {
  production: false,

  azure: {
    clientId: 'b651ec94-94de-4296-b10c-c16eccf8a5aa',
    tenantId: 'b993433f-439b-4f1b-a920-b4d91d2d8329',

    authority: 'https://login.microsoftonline.com/b993433f-439b-4f1b-a920-b4d91d2d8329',

    api: {
      clientId: 'b3c7c3d4-427e-41c2-a2f1-f333156f1c81',

      scope: 'api://b3c7c3d4-427e-41c2-a2f1-f333156f1c81/access_as_user',

      url: 'https://brchdis4d7.execute-api.us-east-1.amazonaws.com',
    },
  },
};