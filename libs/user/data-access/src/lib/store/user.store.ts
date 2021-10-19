import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { UserDetails } from '@hidden-innovation/shared/models';
import { EMPTY, Observable } from 'rxjs';
import { UserListingRequest } from '../models/user.interface';
import { catchError, distinctUntilChanged, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { UserBlockRequest } from '@hidden-innovation/user/user-details';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';

export interface UserState {
  users?: UserDetails[];
  total?: number;
  selectedUser?: UserDetails;
  isLoading?: boolean;
  isActing?: boolean;
}

const initialState: UserState = {
  users: [],
  total: 0,
  isLoading: false,
  isActing: false
};

@Injectable()
export class UserStore extends ComponentStore<UserState> {

  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly isActing$: Observable<boolean> = this.select(state => !!state.isActing);
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
  private toastRef: CreateHotToastRef<unknown> | undefined;
  toggleBlockUser$ = this.effect<UserBlockRequest>(params$ =>
    params$.pipe(
      tap(({ data }) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading(data.is_blocked ? 'Blocking User...' : 'Unblocking User...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap((blockObj) =>
        this.userService.blockUser(blockObj).pipe(
          tapResponse(
            (updatedUser) => {
              this.patchState({
                isActing: false,
                selectedUser: updatedUser
              });
              this.toastRef?.updateMessage(updatedUser.is_blocked ? 'Success! User blocked' : 'Success! User unblocked');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success'
              });
            },
            (_) => {
              this.patchState({
                isActing: false
              });
            }
          )
        )
      )
    )
  );

  constructor(
    private hotToastService: HotToastService,
    private userService: UserService) {
    super(initialState);
  }
}
