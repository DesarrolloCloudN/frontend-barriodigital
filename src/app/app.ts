import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { MsalService } from '@azure/msal-angular';
import { AuthService } from './services/auth.service';

// Componente raíz: maneja el resultado del login MSAL y redirige al dashboard.
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private msalService = inject(MsalService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // El resultado del login llega por este observable cuando Microsoft redirige de vuelta.
    this.msalService.handleRedirectObservable().subscribe({
      next: async (result) => {
        if (result?.account) {
          this.msalService.instance.setActiveAccount(result.account);

          console.log('Usuario autenticado:', result.account);

          // Se esperan los roles antes de navegar para que los guards ya los tengan.
          await this.authService.loadRoles();

          this.router.navigate(['/dashboard']);
        }
      },

      error: (error) => {
        console.error('Error procesando autenticación MSAL:', error);
      },
    });

    const accounts = this.msalService.instance.getAllAccounts();

    if (accounts.length > 0) {
      this.msalService.instance.setActiveAccount(accounts[0]);

      console.log('Sesión existente:', accounts[0]);

      this.authService.loadRoles().then(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }
}