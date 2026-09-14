import { Injectable, inject, signal } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../environments/environment';

// Envuelve MSAL para simplificar login/logout y consultar cuenta y roles del usuario.
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private msalService = inject(MsalService);

  login(): void {
    this.msalService.loginRedirect({
      scopes: ['openid', 'profile', environment.azure.api.scope],
      prompt: 'select_account',
    });
  }

  logout(): void {
    this.msalService.logoutRedirect();
  }

  isLoggedIn(): boolean {
    return this.msalService.instance.getAllAccounts().length > 0;
  }

  getAccount() {
    return this.msalService.instance.getActiveAccount();
  }

  // Signal (no campo plano) para que las vistas se actualicen solas apenas
  // termine de cargar, aunque el componente se haya construido antes.
  private rolesSignal = signal<string[]>([]);

  // Los roles se asignan sobre la app del BFF, asi que solo aparecen en el
  // access token de esa API, no en el idToken del login. Se piden aparte y se cachean.
  async loadRoles(): Promise<void> {
    const account = this.getAccount();

    if (!account) {
      this.rolesSignal.set([]);
      return;
    }

    try {
      // MSAL exige inicializar la instancia antes de usarla directamente (no via guard/interceptor).
      await this.msalService.instance.initialize();

      const result = await this.msalService.instance.acquireTokenSilent({
        scopes: [environment.azure.api.scope],
        account,
      });

      this.rolesSignal.set(this.decodeRolesFromAccessToken(result.accessToken));
    } catch (error) {
      console.error('No se pudo obtener el access token de la API para leer roles:', error);
      this.rolesSignal.set([]);
    }
  }

  private decodeRolesFromAccessToken(accessToken: string): string[] {
    const payload = accessToken.split('.')[1];
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

    while (base64.length % 4 !== 0) {
      base64 += '=';
    }

    const claims = JSON.parse(atob(base64));
    const roles = claims['roles'];

    return Array.isArray(roles) ? (roles as string[]) : [];
  }

  // Se expone de solo lectura para que los componentes puedan leerlo como signal.
  readonly roles = this.rolesSignal.asReadonly();

  getRoles(): string[] {
    return this.rolesSignal();
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const misRoles = this.getRoles();

    return roles.some((rol) => misRoles.includes(rol));
  }
}
