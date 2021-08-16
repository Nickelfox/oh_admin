import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map, switchMap, tap} from 'rxjs/operators';
import {HotToastService} from "@ngneat/hot-toast";

import * as AuthActions from './auth.actions';
import {of} from 'rxjs';
import {AuthService, AuthStorageService} from "../services";
import {Router} from "@angular/router";


@Injectable()
export class AuthEffects {

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap((authReq) => this.authService.login(authReq.email, authReq.password).pipe(
          map(response => AuthActions.loginSuccess({
            loggedIn: response.data.loggedIn,
            token: response.data.session_id,
            session_id: response.data.session_id,
            isLoading: false
          })),
          tap((res) => {
            this.toast.close();
            this.toast.success('Logged In', {
              autoClose: true,
              role: 'status',
              dismissible: true
            });
            this.storage.setAuthToken(res.session_id);
            this.router.navigate(['/']);
          }),
          catchError((error) => {
            this.toast.close();
            this.toast.error(error.error.error.message[0], {
              autoClose: true,
              role: 'alert',
              dismissible: true
            });
            return of(AuthActions.loginFail({isLoading: false}));
          })
        )
      )
    )
  );

  isLoggedIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkLogin),
      exhaustMap((_) => this.storage.getAuthToken().pipe(
          map((response) => AuthActions.checkLoginSuccess({
            loggedIn: false,
            session_id: response || '',
            token: response || '',
          })),
          catchError((_) => {
            this.storage.clearStorage();
            return of(AuthActions.checkLoginFail({
              loggedIn: false,
              session_id: '',
              token: ''
            }));
          })
        ),
      ),
    )
  );

  constructor(
    private router: Router,
    private readonly actions$: Actions,
    private authService: AuthService,
    private storage: AuthStorageService,
    private toast: HotToastService) {
  }
}
