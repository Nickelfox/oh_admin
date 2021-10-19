import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { UserDetails } from '@hidden-innovation/shared/models';
import { EMPTY, Observable } from 'rxjs';
import { UserListingRequest } from '../models/user.interface';
import { catchError, distinctUntilChanged, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { UserBlockRequest } from '@hidden-innovation/user/user-details';

export interface UserState {
  users?: UserDetails[];
  total?: number;
  selectedUser?: UserDetails;
  isLoading?: boolean;
}

const initialState: UserState = {
  users: [],
  total: 0,
  isLoading: false
};

@Injectable()
export class UserStore extends ComponentStore<UserState> {

  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly count$: Observable<number> = this.select(state => state.total || 0);
  readonly selectedUser$: Observable<UserDetails | undefined> = this.select(state => state.selectedUser);

  readonly updateUsers$ = this.updater<UserState>(({ isLoading }, {
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
        this.userService.getUsers({ limit, page }).pipe(
          tapResponse(
            ({ users, total }) => {
              this.patchState({
                isLoading: false
              });
              this.updateUsers$({
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

  getUserDetails$ = this.effect<{ id: number }>(params$ =>
    params$.pipe(
      distinctUntilChanged((x, y) => x.id === y.id),
      tap((res) => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap(({ id }) =>
        this.userService.getUserDetails(id).pipe(
          tapResponse(
            (user) => {
              this.patchState({
                isLoading: false,
                selectedUser: user
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

  blockUser$ = this.effect<UserBlockRequest>(params$ =>
    params$.pipe(
      tap(({ data }) => {
        this.patchState({
          isLoading: true
        });
      }),
      exhaustMap((blockObj) =>
        this.userService.blockUser(blockObj).pipe(
          tapResponse(
            (user) => {
              this.patchState({
                isLoading: false,
                selectedUser: user
              });
            },
            (_) => {
              this.patchState({
                isLoading: false
              });
            }
          )
        )
      )
    )
  );

  constructor(
    private userService: UserService) {
    super(initialState);
  }
}
