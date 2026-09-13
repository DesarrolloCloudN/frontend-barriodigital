import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { MsalService } from '@azure/msal-angular';

// Componente raíz de la aplicación. Se encarga de manejar el resultado del login con Microsoft
// (MSAL) apenas se carga la app, y de redirigir al usuario al dashboard si corresponde.
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private msalService = inject(MsalService);
  private router = inject(Router);

  // Se ejecuta apenas se crea el componente raíz (o sea, al cargar la app).
  ngOnInit(): void {
    // Cuando Microsoft redirige de vuelta después del login, este observable entrega el resultado.
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

    // Si ya existe una sesión, establecemos la cuenta activa.
    const accounts = this.msalService.instance.getAllAccounts();

    if (accounts.length > 0) {
      this.msalService.instance.setActiveAccount(accounts[0]);

      console.log('Sesión existente:', accounts[0]);

      this.router.navigate(['/dashboard']);
    }
  }
}