import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';


import * as AuthActions from './auth.actions';
import { LocalStorageService } from '../local-storage.service';
import { of } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';


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
          }),
          catchError((error) => {
            this.toast.close();
            return of(AuthActions.loginFail({ errorMessage: error.error.error.message[0], isLoading: false }));
          })
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private authService: AuthService,
    private storage: LocalStorageService,
    private toast: HotToastService) {
  }
}
