import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EditAdminProfileRequest } from './models/edit-admin-profile.interface';
import { EMPTY, Observable } from 'rxjs';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { EditAdminProfileService } from './services/edit-admin-profile.service';
import { AuthFacade } from '@hidden-innovation/auth';
import { catchError, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { isEqual } from 'lodash-es';

export interface EditAdminProfileState extends Partial<EditAdminProfileRequest> {
  isLoading?: boolean;
}

const initialState: EditAdminProfileState = {
  isLoading: false
};

@Injectable()
export class EditAdminProfileStore extends ComponentStore<EditAdminProfileState> {

  readonly isEditLoading$: Observable<boolean> = this.select(state => !!state.isLoading);

  private toastRef: CreateHotToastRef<unknown> | undefined;

  editAdminProfile = this.effect<EditAdminProfileState>(params$ =>
    params$.pipe(
      tap(() => {
        this.patchState({
          isLoading: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Loading...', {
          dismissible: false
        });
      }),
      withLatestFrom(this.authFacade.authAdmin$),
      switchMap(([{ name, email }, adminAuth]) =>
        this.editAdminProfileService.editAdminProfile({
          name,
          email
        }, adminAuth?.id).pipe(
          tap(
            (res) => {
              if (!isEqual(email, adminAuth?.email)) {
                this.toastRef?.updateMessage('Success! Please re-login with updated email');
                this.authFacade.logoutLocal();
              } else {
                this.authFacade.updateAdminAuth(res.data);
                this.toastRef?.updateMessage('Success! Admin details updated');
                this.router.navigate(['/']);
              }
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success'
              });
              this.patchState({
                isLoading: false
              });
            },
            (_) => {
              this.toastRef?.close();
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
    private hotToastService: HotToastService,
    private router: Router,
    private editAdminProfileService: EditAdminProfileService,
    private authFacade: AuthFacade
  ) {
    super(initialState);
  }
}
