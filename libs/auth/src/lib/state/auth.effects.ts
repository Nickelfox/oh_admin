import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';

import * as AuthActions from './auth.actions';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStorageService } from '../services/auth-storage.service';
import { authInitialState } from './auth.reducer';


@Injectable()
export class AuthEffects {

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap(() => {
        this.toast.loading('Loading...', {
          role: 'status',
          id: 'login-loading-state'
        });
      }),
      exhaustMap((authReq) => this.authService.login(authReq).pipe(
          tap((res) => {
            this.toast.close();
            this.toast.success('LoggedIn Successfully!', {
              autoClose: true,
              role: 'alert',
              dismissible: true
            });
            this.storage.setAuthAdmin(res.data.admin);
            this.storage.setAuthToken(res.data.token);
            this.router.navigate(['/dashboard']);
          }),
          map(({ message, data }) => AuthActions.loginSuccess({
            token: data.token,
            admin: data.admin
          })),
          catchError((_) => {
            this.toast.close('login-loading-state');
            return of(AuthActions.loginFail(authInitialState));
          })
        )
      )
    )
  );

  checkLoggedIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkLogin),
      exhaustMap((_) => this.storage.getAuthAdmin().pipe(
          map(({ token, admin }) => AuthActions.checkLoginSuccess({
            token,
            admin
          })),
          catchError((_) => {
            this.storage.clearAuthStorage();
            return of(AuthActions.checkLoginFail(authInitialState));
          })
        )
      )
    )
  );

  updateAuthAdmin$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.adminUpdate),
        tap((res) => this.storage.setAuthAdmin(res))
      ),
    {
      dispatch: false
    }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutLocal),
      tap((res) => {
        this.toast.close();
        this.toast.show('Success! You are logged out.', {
          autoClose: true,
          role: 'alert',
          dismissible: true
        });
        this.storage.clearAuthStorage();
        this.router.navigate(['/login']);
      })
    ), { dispatch: false }
  );

  constructor(
    private router: Router,
    private readonly actions$: Actions,
    private authService: AuthService,
    private storage: AuthStorageService,
    private toast: HotToastService) {
  }
}
