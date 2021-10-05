import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as UserListActions from './user-listing.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { userListingInitialState } from './user-listing.reducer';
import { UserListingService } from '../services/user-listing.service';

@Injectable()
export class UserListingEffects {

  getList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserListActions.getList),
      switchMap(({ limit, page }) =>
        this.userListingService.getUsers({ limit, page }).pipe(
          map(({ users, total }) => UserListActions.getListSuccess({
            users,
            total
          })),
          catchError(() => {
            return of(UserListActions.getListFail(userListingInitialState));
          })
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private userListingService: UserListingService
  ) {
  }
}
