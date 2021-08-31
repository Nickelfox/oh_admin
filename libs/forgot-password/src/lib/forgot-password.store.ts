import {Injectable} from '@angular/core';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {ForgotPasswordRequest} from "./models/forgot-password.interface";
import {Observable} from "rxjs";
import {switchMap, tap} from "rxjs/operators";
import {HotToastService} from "@ngneat/hot-toast";
import {Router} from "@angular/router";
import {ForgotPasswordService} from "./services/forgot-password.service";

export interface ForgotPasswordState extends Partial<ForgotPasswordRequest> {
  isLoading?: boolean;
}

const initialState: ForgotPasswordState = {
  isLoading: false,
  email: ''
};

@Injectable()
export class ForgotPasswordStore extends ComponentStore<ForgotPasswordState> {

  readonly isForgotLoading$: Observable<boolean> = this.select(state => !!state.isLoading);

  private readonly toastStateName = 'forgot-loading-state';

  forgotPassword = this.effect<ForgotPasswordState>(params$ =>
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
      switchMap(({email}) =>
        this.forgotPasswordService.forgotPassword({email}).pipe(
          tapResponse(
            (res) => {
              this.patchState({
                isLoading: false,
              });
              this.hotToastService.close(this.toastStateName);
              this.router.navigate(['/reset-password']);
              this.hotToastService.success(res.message, {
                dismissible: true,
                role: "status"
              })
            },
            (err) => {
              this.patchState({
                isLoading: false,
              });
              this.hotToastService.close(this.toastStateName);
            },
          )
        )
      )
    )
  )

  constructor(
    private hotToastService: HotToastService,
    private router: Router,
    private forgotPasswordService: ForgotPasswordService
  ) {
    super(initialState);
  }
}
