import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthFacade } from './+state';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authFacade: AuthFacade, private router: Router) {
  }

  canActivate(): Observable<boolean> {
    return this.authFacade.token$.pipe(
      switchMap((token) => {
        if (!token) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }

}
