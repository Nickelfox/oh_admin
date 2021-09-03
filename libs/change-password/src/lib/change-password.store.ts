import {Injectable} from '@angular/core';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {ChangePasswordRequest} from "./models/change-password.interface";
import {Observable} from "rxjs";
import {switchMap, tap} from "rxjs/operators";
import {HotToastService} from "@ngneat/hot-toast";
import {Router} from "@angular/router";
import {ChangePasswordService} from "./services/change-password.service";
import {AuthFacade} from "@hidden-innovation/auth";

export interface ChangePasswordState extends Partial<ChangePasswordRequest> {
  isLoading?: boolean;
};

const initialState: ChangePasswordState = {
  isLoading: false
};

@Injectable()
export class ChangePasswordStore extends ComponentStore<ChangePasswordState> {

  readonly isChangeLoading$: Observable<boolean> = this.select(state => !!state.isLoading);

  private readonly toastStateName = 'change-pass-loading-state';

  changePassword = this.effect<ChangePasswordState>(params$ =>
    params$.pipe(
      tap(() => {
        this.patchState({
          isLoading: true,
        });
        this.hotToastService.loading('Loading...', {
          dismissible: false,
          role: "status",
          id: this.toastStateName
        })
      }),
      switchMap((changePassObj) =>
        this.changePasswordService.changePassword(changePassObj).pipe(
          tapResponse(
            (res) => {
              this.patchState({
                isLoading: false,
              });
              this.hotToastService.close(this.toastStateName);
              this.hotToastService.success(res.message, {
                dismissible: true,
                role: "status"
              })
              this.authFacade.logoutLocal();
            },
            (err) => {
              this.patchState({
                isLoading: false,
              });
              this.hotToastService.close(this.toastStateName);
            },
          )
        )
      ),
    )
  )

  constructor(
    private hotToastService: HotToastService,
    private router: Router,
    private changePasswordService: ChangePasswordService,
    private authFacade: AuthFacade
  ) {
    super(initialState);
  }
}
