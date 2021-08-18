import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map, tap} from 'rxjs/operators';
import {HotToastService} from "@ngneat/hot-toast";

import * as AuthActions from './auth.actions';
import {of} from 'rxjs';
import {AuthService, AuthStorageService} from "../services";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {CustomApiResponse} from "@hidden-innovation/shared/models";


@Injectable()
export class AuthEffects {

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap((authReq) => this.authService.login(authReq).pipe(
          map(({message, data}) => AuthActions.loginSuccess({
            loggedIn: true,
            token: data,
            message,
            isLoading: false
          })),
          tap((res) => {
            this.toast.close();
            this.toast.show(res.message ?? 'Success!!', {
              autoClose: true,
              role: 'alert',
              dismissible: true
            });
            this.storage.setAuthToken(res.token);
            this.router.navigate(['/']);
          }),
          catchError((err: HttpErrorResponse) => {
            this.toast.close();
            const apiError: CustomApiResponse = err.error;
            this.toast.show(apiError.message ?? 'Unknown Error!', {
              autoClose: true,
              role: 'alert',
              dismissible: true
            });
            return of(AuthActions.loginFail({
              isLoading: false,
              loggedIn: false,
              message: apiError.message,
            }));
          })
        )
      )
    )
  );

  isLoggedIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkLogin),
      exhaustMap((_) => this.storage.getAuthToken().pipe(
          map((token) => AuthActions.checkLoginSuccess({
            loggedIn: false,
            token: token || '',
          })),
          catchError((_) => {
            this.storage.clearStorage();
            return of(AuthActions.checkLoginFail({
              loggedIn: false,
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
