import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as UserListActions from './user-listing.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { UserListingService } from '../services/user-listing.service';
import { of } from 'rxjs';

@Injectable()
export class UserListingEffects {

  private userToast?: CreateHotToastRef<unknown>;

  getList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserListActions.getList),
      tap(() => {
        this.userToast = this.toast.loading('Fetching Users...', {
          role: 'status',
          dismissible: false
        });
      }),
      switchMap(({ limit, page }) =>
        this.userListingService.getUsers({ limit, page }).pipe(
          tap(() => {
            this.userToast?.close();
          }),
          map(({ users, total }) => UserListActions.getListSuccess({
            users,
            total
          })),
          catchError(() => {
            this.userToast?.close();
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
    private toast: HotToastService,
    private userListingService: UserListingService
  ) {
  }
}
