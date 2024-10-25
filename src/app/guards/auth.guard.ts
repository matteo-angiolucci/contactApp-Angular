import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  //inject of the service without constructor

  const authService = inject(AuthService);
  const router = inject(Router);

     // Get localStorage check result
  //const isLocalStorageLoggedIn = authService.isLoggedInLocalStorageInfo(); // Check localStorage

  // Combine both checks (localStorage and observable)
  // return combineLatest([
  //   of(isLocalStorageLoggedIn),    // Observable of localStorage status
  //   authService.isLogged$()        // Observable from service
  // ]).pipe(
  //   map(([localStorageLogged, serviceLogged]) => localStorageLogged || serviceLogged), // Check if either is true
  //   tap(isLoggedIn => {
  //     if (!isLoggedIn) {
  //       // Redirect to login if neither is true
  //       router.navigate(['/login']);
  //     }
  //   })
  // );

  return authService.isLogged$().pipe(
    take(1), // Take the latest value and complete the observable
    map((isLogged : boolean) => {
      if (isLogged) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
}
