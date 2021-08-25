import {Injectable} from '@angular/core';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {switchMap, tap} from "rxjs/operators";
import {ResetPasswordService} from "./services/reset-password.service";
import {HotToastService} from "@ngneat/hot-toast";
import {ResetPasswordRequest} from "@hidden-innovation/reset-password";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

export interface ResetPasswordState extends Partial<ResetPasswordRequest> {
  isLoading?: boolean;
}

const initialState: ResetPasswordState = {
  isLoading: false
};

@Injectable()
export class ResetPasswordStore extends ComponentStore<ResetPasswordState> {

  readonly isResetLoading$: Observable<boolean> = this.select(state => !!state.isLoading);

  resetPassword = this.effect<ResetPasswordState>((params$) =>
    params$.pipe(
      tap(() => {
        this.patchState({
          isLoading: true,
        });
        this.hotToastService.loading('Loading...', {
          dismissible: false,
          role: "status",
          id: 'reset-loading-state'
        })
      }),
      switchMap(({email, password, code}) =>
        this.resetPasswordService.resetPassword({email, password, code}).pipe(
          tapResponse(
            (res) => {
              this.patchState({
                isLoading: false,
              });
              this.hotToastService.close('reset-loading-state');
              this.router.navigate(['/login']);
              this.hotToastService.success(res.message, {
                dismissible: true,
                role: "status"
              })
            },
            (err) => {
              this.patchState({
                isLoading: false,
              });
              this.hotToastService.close('reset-loading-state');
            },
          )
        )
      )
    )
  )

  constructor(
    private resetPasswordService: ResetPasswordService,
    private hotToastService: HotToastService,
    private router: Router,
  ) {
    super(initialState);
  }
}
