import { Injectable, inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../environments/environment';

// Este servicio envuelve a MSAL (la librería de login de Microsoft) para dejar más simple
// iniciar/cerrar sesión y consultar la cuenta y los roles del usuario que está logueado.
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private msalService = inject(MsalService);

  // Inicia el login redirigiendo al usuario a la pantalla de Microsoft.
  login(): void {
    this.msalService.loginRedirect({
      scopes: ['openid', 'profile', environment.azure.api.scope],
      prompt: 'select_account',
    });
  }

  // Cierra la sesión redirigiendo al usuario a Microsoft para terminar el logout.
  logout(): void {
    this.msalService.logoutRedirect();
  }

  isLoggedIn(): boolean {
    return this.msalService.instance.getAllAccounts().length > 0;
  }

  // Devuelve la cuenta activa (el usuario que inició sesión), o null si no hay nadie logueado.
  getAccount() {
    return this.msalService.instance.getActiveAccount();
  }

  // Saca los roles del usuario desde el token (idTokenClaims). Si no hay roles, devuelve un arreglo vacío.
  getRoles(): string[] {
    const roles = this.msalService.instance.getActiveAccount()?.idTokenClaims?.[
      'roles'
    ];

    return Array.isArray(roles) ? (roles as string[]) : [];
  }

  // Revisa si el usuario tiene un rol en particular.
  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  // Revisa si el usuario tiene al menos uno de los roles indicados (se usa harto para permisos).
  hasAnyRole(roles: string[]): boolean {
    const misRoles = this.getRoles();

    return roles.some((rol) => misRoles.includes(rol));
  }
}
