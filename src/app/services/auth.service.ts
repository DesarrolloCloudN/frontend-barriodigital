import { Injectable, inject } from '@angular/core';
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

  // Los roles vienen en idTokenClaims; si no hay, devolvemos arreglo vacío.
  getRoles(): string[] {
    const roles = this.msalService.instance.getActiveAccount()?.idTokenClaims?.[
      'roles'
    ];

    return Array.isArray(roles) ? (roles as string[]) : [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const misRoles = this.getRoles();

    return roles.some((rol) => misRoles.includes(rol));
  }
}
