import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as UserListActions from './user-listing.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';
import { UserListingService } from '../services/user-listing.service';
import { of } from 'rxjs';

@Injectable()
export class UserListingEffects {

  setList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserListActions.setListPage),
      map(({ limit, page }) => UserListActions.getList({ limit, page }))
    )
  );

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
            return of(UserListActions.getListFail({
              total: 0,
              users: []
            }));
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
