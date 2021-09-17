import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as UserDetailsActions from './user-details.actions';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { UserDetailsService } from '../services/user-details.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { userDetailsInitialState } from '@hidden-innovation/user/user-details';

@Injectable()
export class UserDetailsEffects {

  private userToast?: CreateHotToastRef<unknown>;

  getUserDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserDetailsActions.getUserDetails),
      tap(() => {
        this.userToast = this.toast.loading('Fetching User Details...', {
          role: 'status',
          dismissible: false
        });
      }),
      switchMap(({ id }) =>
        this.userDetailsService.getUserDetails(id).pipe(
          tap(() => {
            this.userToast?.close();
          }),
          map((details) => UserDetailsActions.getUserDetailsSuccess({
            id: details.id,
            email: details.email,
            username: details.username,
            role: details.role,
            name: details.name,
            language: details.language,
            created_at: details.created_at,
            updated_at: details.updated_at
          })),
          catchError(() => {
            this.userToast?.close();
            return of(UserDetailsActions.getUserDetailsFail(userDetailsInitialState));
          })
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private toast: HotToastService,
    private userDetailsService: UserDetailsService
  ) {
  }
}
