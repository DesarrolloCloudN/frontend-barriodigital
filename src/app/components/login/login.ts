import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

// Pantalla de inicio de sesión. Solo muestra un botón que dispara el login con Microsoft.
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);

  // Se llama cuando el usuario aprieta el botón de "Iniciar sesión".
  login(): void {
    this.authService.login();
  }
}