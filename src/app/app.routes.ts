import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

import { LoginComponent } from './components/login/login';
import { roleGuard } from './guards/role.guard';

// Aquí se definen todas las rutas (pantallas) de la aplicación y quién puede entrar a cada una.
export const routes: Routes = [
  {
    // Si entran a la raíz del sitio, los mandamos directo al login.
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    // MsalGuard exige que el usuario haya iniciado sesión para poder ver el dashboard.
    path: 'dashboard',
    canActivate: [MsalGuard],
    loadComponent: () =>
      import('./components/dashboard/dashboard').then(
        (m) => m.DashboardComponent
      ),
  },

  {
    // También requiere sesión iniciada.
    path: 'requests',
    canActivate: [MsalGuard],
    loadComponent: () =>
      import('./components/requests/requests').then(
        (m) => m.RequestsComponent
      ),
  },

  {
    // El catálogo además requiere el rol Admin o Funcionario (lo valida roleGuard usando data.roles).
    path: 'catalog',
    canActivate: [MsalGuard, roleGuard],
    data: { roles: ['Admin', 'Funcionario'] },
    loadComponent: () =>
      import('./components/catalog/catalog').then((m) => m.CatalogComponent),
  },

  {
    // Cualquier ruta que no exista cae aquí y se redirige al login.
    path: '**',
    redirectTo: 'login',
  },
];
