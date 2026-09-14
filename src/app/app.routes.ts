import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

import { LoginComponent } from './components/login/login';
import { roleGuard } from './guards/role.guard';

// Define las rutas de la app y quién puede acceder a cada una.
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    // MsalGuard exige sesión iniciada para ver el dashboard.
    path: 'dashboard',
    canActivate: [MsalGuard],
    loadComponent: () =>
      import('./components/dashboard/dashboard').then(
        (m) => m.DashboardComponent
      ),
  },

  {
    path: 'requests',
    canActivate: [MsalGuard],
    loadComponent: () =>
      import('./components/requests/requests').then(
        (m) => m.RequestsComponent
      ),
  },

  {
    // El catálogo requiere rol Admin (lo valida roleGuard).
    path: 'catalog',
    canActivate: [MsalGuard, roleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./components/catalog/catalog').then((m) => m.CatalogComponent),
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
