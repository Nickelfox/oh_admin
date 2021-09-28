import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
// import {AuthFacade} from "../state/auth.facade";
import {Validators} from "@angular/forms";
import {FormValidationService} from "@hidden-innovation/shared/form-config";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {FormControl} from "@ngneat/reactive-forms";
import {AuthFacade} from '@hidden-innovation/auth';
import {ForgotPasswordStore} from "./forgot-password.store";

@Component({
  selector: 'hidden-innovation-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {

  email: FormControl = new FormControl<string>('', [
    RxwebValidators.email(),
    RxwebValidators.required(),
    Validators.required
  ]);

  constructor(
    public store: ForgotPasswordStore,
    public authFacade: AuthFacade,
    public formValidationService: FormValidationService
  ) {
  }

  submit(): void {
    if (this.email.invalid) {
      return;
    }
    const email = this.email.value;
    this.store.forgotPassword({email});
  }
}
