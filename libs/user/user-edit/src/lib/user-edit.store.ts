import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { UserUpdateRequest } from './models/user-update.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { UserEditService } from './services/user-edit.service';
import { UserDetailsStore } from '@hidden-innovation/user/user-details';

export interface UserEditState extends Partial<UserUpdateRequest> {
  isLoading?: boolean;
}

const initialState: UserEditState = {
  isLoading: false
};

@Injectable()
export class UserEditStore extends ComponentStore<UserEditState> {

  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  private userEditToast = 'user-edit-toast';
  private toastRef: CreateHotToastRef<unknown> | undefined;

  updateUser = this.effect<{ id: number, obj: UserUpdateRequest }>(params$ =>
    params$.pipe(
      tap(() => {
        this.patchState({
          isLoading: true
        });
        this.toastRef = this.hotToastService.loading('Updating...', {
          dismissible: false,
          id: this.userEditToast
        });
      }),
      switchMap((req) =>
        this.userEditService.updateUserDetails(req.obj, req.id).pipe(
          tap(
            (res) => {
              this.patchState({
                isLoading: false,
                ...res
              });
              this.userDetailsStore.updateState$(res);
              this.toastRef?.updateMessage('User Updated!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
                duration: 300
              });
              this.router.navigate(['/users', 'details', res.id]);
            },
            (_) => {
              this.patchState({
                isLoading: false
              });
              this.toastRef?.close();
            }
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private router: Router,
    private hotToastService: HotToastService,
    private userEditService: UserEditService,
    private userDetailsStore: UserDetailsStore
  ) {
    super(initialState);
  }
}
