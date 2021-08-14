import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private storage: LocalStorageService) {
  }

  canActivate(): Observable<boolean> {
    return this.storage.getAuthToken().pipe(
      map(token => {
        if (!token) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }),
      take(1)
    );
  }

}
