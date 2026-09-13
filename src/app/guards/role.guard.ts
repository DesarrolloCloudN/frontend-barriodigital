import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

// Guard de rutas: revisa si el usuario tiene alguno de los roles permitidos para esa ruta
// (los roles se definen en app.routes.ts dentro de la propiedad "data"). Si no tiene el rol,
// lo redirige al dashboard y bloquea el acceso.
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
