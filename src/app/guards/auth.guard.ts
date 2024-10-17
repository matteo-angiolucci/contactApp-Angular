import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  //inject of the service without constructor

  const authService = inject(AuthService);
  const router = inject(Router);

    // we use the observable isLogged$ from the auth service to get the value
    return authService.isLogged$().pipe(
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          router.navigate(['/login']);  // Redirect if not logged in
        }
      })
    );
};
