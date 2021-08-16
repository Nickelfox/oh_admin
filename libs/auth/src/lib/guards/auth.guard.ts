import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {AuthStorageService} from "../services";
import {AuthFacade} from "../state";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authFacade: AuthFacade) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authFacade.token$.pipe(
      map((token) => {
        if (token) {
          return true;
        }
        this.router.navigate(['/login'], {
          queryParams: {
            returnUrl: state.url
          }
        });
        return false;
      }),
      take(1),
    );
  }

}
