import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

// Guard de rutas: si el usuario no tiene el rol permitido, lo redirige al dashboard.
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const rolesPermitidos: string[] = route.data['roles'] ?? [];

  if (authService.hasAnyRole(rolesPermitidos)) {
    return true;
  }

  router.navigate(['/dashboard']);

  return false;
};
