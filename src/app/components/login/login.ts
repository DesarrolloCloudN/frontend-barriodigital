import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

// Pantalla de login: un botón que dispara el login con Microsoft.
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);

  login(): void {
    this.authService.login();
  }
}