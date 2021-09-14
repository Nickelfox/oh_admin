import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EditAdminProfileRequest } from './models/edit-admin-profile.interface';
import { EMPTY, Observable } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { EditAdminProfileService } from './services/edit-admin-profile.service';
import { AuthFacade } from '@hidden-innovation/auth';
import { catchError, switchMap, tap, withLatestFrom } from 'rxjs/operators';

export interface EditAdminProfileState extends Partial<EditAdminProfileRequest> {
  isLoading?: boolean;
}

const initialState: EditAdminProfileState = {
  isLoading: false
};

@Injectable()
export class EditAdminProfileStore extends ComponentStore<EditAdminProfileState> {

  readonly isEditLoading$: Observable<boolean> = this.select(state => !!state.isLoading);

  private readonly toastStateName = 'edit-admin-profile-loading-state';

  editAdminProfile = this.effect<EditAdminProfileState>(params$ =>
    params$.pipe(
      tap(() => {
        console.log('Called');
        this.patchState({
          isLoading: true
        });
        this.hotToastService.loading('Loading...', {
          dismissible: false,
          role: 'status',
          id: this.toastStateName
        });
      }),
      withLatestFrom(this.authFacade.authAdmin$),
      switchMap(([requestObj, adminAuth]) =>
        this.editAdminProfileService.editAdminProfile({
          name: requestObj.name,
          username: requestObj.username
        }, adminAuth?.id).pipe(
          tap(
            (res) => {
              this.hotToastService.close(this.toastStateName);
              this.hotToastService.success(res.message, {
                dismissible: true,
                role: 'status'
              });
              this.patchState({
                isLoading: false
              });
              this.authFacade.updateAdminAuth(res.data);

            },
            (_) => {
              this.patchState({
                isLoading: false
              });
              this.hotToastService.close(this.toastStateName);
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
