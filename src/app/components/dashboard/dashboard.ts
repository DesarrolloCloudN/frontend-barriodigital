import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

// Pantalla principal: datos del usuario y accesos rápidos a las demás secciones.
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  private authService = inject(AuthService);

  account = this.authService.getAccount();

  roles = this.authService.getRoles();

  puedeVerCatalogo = this.authService.hasAnyRole(['Admin', 'Funcionario']);

  logout(): void {
    this.authService.logout();
  }
}
