import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { UserListingRequest, UserListingResponseData } from './models/user-listing.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { UserListingService } from './services/user-listing.service';

export interface UserListingState extends Partial<UserListingResponseData> {
  isLoading?: boolean;
}

const initialState: UserListingState = {
  isLoading: false,
  total: 0,
  users: []
};

@Injectable()
export class UserListingStore extends ComponentStore<UserListingState> {

  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly count$: Observable<number> = this.select(state => state.total || 0);

  readonly updateState$ = this.updater<UserListingState, UserListingResponseData>(({ isLoading }, {
    users,
    total
  }) => ({ isLoading, users, total }));

  getUsers$ = this.effect<UserListingRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap(({ page, limit }) =>
        this.userListingService.getUsers({ limit, page }).pipe(
          tapResponse(
            ({ users, total }) => {
              this.patchState({
                isLoading: false
              });
              this.updateState$({
                users, total
              });
            },
            (_) => {
              this.patchState({
                isLoading: false
              });
            }
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private userListingService: UserListingService
  ) {
    super(initialState);
  }
}
