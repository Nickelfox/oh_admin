import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map, take} from "rxjs/operators";
import {AuthFacade} from "../state/auth.facade";

@Injectable()
export class LoggedInGuard implements CanActivate {

  constructor(private router: Router, private authFacade: AuthFacade) {
  }

  canActivate(): Observable<boolean> {
    return this.authFacade.token$.pipe(
      map((token) => {
        if (!token) {
          return true;
        }
        this.router.navigate(['/']);
        return false;
      }),
      take(1),
    );
  }

}
