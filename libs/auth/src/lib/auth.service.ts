import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Auth } from './+state/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(): Observable<Auth> {
    return of({
      loggedIn: true,
      token: 'asdfsaf4s5a4f4saf454f4a5sdf45s'
    })
  }
}
