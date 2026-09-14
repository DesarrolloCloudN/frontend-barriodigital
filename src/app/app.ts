import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { MsalService } from '@azure/msal-angular';

// Componente raíz: maneja el resultado del login MSAL y redirige al dashboard.
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private msalService = inject(MsalService);
  private router = inject(Router);

  ngOnInit(): void {
    // El resultado del login llega por este observable cuando Microsoft redirige de vuelta.
    this.msalService.handleRedirectObservable().subscribe({
      next: (result) => {
        if (result?.account) {
          this.msalService.instance.setActiveAccount(result.account);

          console.log('Usuario autenticado:', result.account);

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

      this.router.navigate(['/dashboard']);
    }
  }
}