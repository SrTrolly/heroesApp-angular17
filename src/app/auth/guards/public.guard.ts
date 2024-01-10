import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthServices } from '../services/auth.service';
import { inject } from '@angular/core';

const checkAuthStatus = (): boolean | Observable<boolean> => {
  const authService: AuthServices = inject(AuthServices);
  const router: Router = inject(Router);

  return authService.checkAuthentication()
    .pipe(
      tap(isAuthenticated => {
        if (isAuthenticated) {
          router.navigate(["./"]);
        }
      }),
      map(isAuthenticated => !isAuthenticated)
    );

}
export const canMatchPublicGuard: CanMatchFn = (route, segments) => {
  return checkAuthStatus();
};

export const canActivatePublicGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return checkAuthStatus();
};
