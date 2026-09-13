import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

// Pantalla principal después de iniciar sesión. Muestra los datos del usuario, sus roles
// y accesos rápidos a las demás secciones (trámites y, si corresponde, el catálogo).
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  private authService = inject(AuthService);

  // Cuenta del usuario logueado, para mostrar su nombre en la pantalla.
  account = this.authService.getAccount();

  // Roles del usuario (vienen del token), para mostrarlos y decidir qué mostrar.
  roles = this.authService.getRoles();

  // Solo Admin o Funcionario pueden ver el enlace al catálogo de trámites.
  puedeVerCatalogo = this.authService.hasAnyRole(['Admin', 'Funcionario']);

  // Cierra la sesión del usuario.
  logout(): void {
    this.authService.logout();
  }
}
