import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { GenericDialogPrompt, UserDetails } from '@hidden-innovation/shared/models';
import { EMPTY, Observable } from 'rxjs';
import { UserBlockRequest, UserListingRequest } from '../models/user.interface';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { MatDialog } from '@angular/material/dialog';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';

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
      switchMap(({ page, limit, name }) =>
        this.userService.getUsers({ limit, page, name }).pipe(
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
      // distinctUntilChanged((x, y) => x.id === y.id),
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
  private toggleBlockUser$ = this.effect<UserBlockRequest>(params$ =>
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
              const tempUsers: UserDetails[] = this.get().users || [];
              this.patchState({
                isActing: false,
                selectedUser: updatedUser,
                users: [...tempUsers.map(user => user.id === blockObj.id ? updatedUser : user)]
              });
              this.toastRef?.updateMessage(updatedUser.is_blocked ? 'Success! User blocked' : 'Success! User unblocked');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success'
              });
              // this.hotToastService.success(user.is_blocked ? 'Success! User blocked' : 'Success! User unblocked', {
              //   dismissible: true,
              //   role: 'status'
              // });
            },
            (_) => {
              this.toastRef?.close();
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
    private matDialog: MatDialog,
    private hotToastService: HotToastService,
    private userService: UserService) {
    super(initialState);
  }

  toggleBlock(id: number, currentState: boolean): void {
    const updatedState = !currentState;
    const dialogData: GenericDialogPrompt = {
      title: updatedState ? 'Blocking User?' : 'Unblocking User?',
      desc: `Are you sure you want to ${updatedState ? 'block this user' : 'unblock this user'}?`,
      action: {
        posTitle: 'Yes',
        negTitle: 'No',
        type: 'mat-primary'
      }
    };
    const dialogRef = this.matDialog.open(PromptDialogComponent, {
      data: dialogData,
      minWidth: '25rem'
    });
    dialogRef.afterClosed().subscribe((proceed: boolean) => {
      if (proceed) {
        this.toggleBlockUser$({
          id,
          data: {
            is_blocked: updatedState
          }
        });
      }
    });
  }
}
