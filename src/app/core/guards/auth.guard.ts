import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Prevents unauthenticated users from accessing protected routes. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

/** Prevents authenticated users from accessing login/register pages. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return true;
  }

  router.navigateByUrl(auth.getRedirectUrl());
  return false;
};

/** Only allows admin users. */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated() && auth.isAdmin()) {
    return true;
  }

  if (auth.isAuthenticated() && auth.isCustomer()) {
    router.navigate(['/cars']);
    return false;
  }

  router.navigate(['/login']);
  return false;
};

/** Only allows customer users. */
export const customerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated() && auth.isCustomer()) {
    return true;
  }

  if (auth.isAuthenticated() && auth.isAdmin()) {
    router.navigate(['/admin/cars']);
    return false;
  }

  router.navigate(['/login']);
  return false;
};
