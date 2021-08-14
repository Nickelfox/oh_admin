import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { AuthService } from '../auth.service';



import * as AuthActions from './auth.actions';


@Injectable()
export class AuthEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(() => this.authService.login().pipe(
          map(response => AuthActions.loginSuccess({
            loggedIn: response.loggedIn,
            token: response.token
          })),
          catchError(result => of(result))
        ),
      )
    )
  );

  constructor(private readonly actions$: Actions, private authService: AuthService) {}
}
