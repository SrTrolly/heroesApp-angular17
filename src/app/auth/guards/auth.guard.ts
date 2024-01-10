import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, Routes, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthServices } from '../services/auth.service';



const checkAuthStatus = (): boolean | Observable<boolean> => {
  const authService: AuthServices = inject(AuthServices);
  const router: Router = inject(Router);

  return authService.checkAuthentication()
    .pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          router.navigate(["/auth/login"]);
        }
      })
    );

}

export const canActivateAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return checkAuthStatus();
};

export const canMatchAuthGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  return checkAuthStatus();
};


