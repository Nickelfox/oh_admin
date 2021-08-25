import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ResetPasswordStore} from './reset-password.store';
import {FormBuilder, FormControl, FormGroup} from "@ngneat/reactive-forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {Validators} from "@angular/forms";
import {FormValidationService} from "@hidden-innovation/shared/form-config";
import {ResetPasswordRequest} from "@hidden-innovation/reset-password";

@Component({
  selector: 'hidden-innovation-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ResetPasswordStore]
})
export class ResetPasswordComponent {

  resetPassForm: FormGroup<ResetPasswordRequest>;

  passwordHidden = {
    pass: true,
    confPass: true
  }

  constructor(
    public store: ResetPasswordStore,
    public formValidationService: FormValidationService,
    private fb: FormBuilder
  ) {
    this.resetPassForm = this.fb.group<ResetPasswordRequest>({
      email: new FormControl<string>('', [
        RxwebValidators.required(),
        Validators.required,
        RxwebValidators.email()
      ]),
      password: new FormControl<string>('', [
        RxwebValidators.required(),
        Validators.required,
        this.formValidationService.validPassword
      ]),
      confirmPassword: new FormControl<string>('', [
        RxwebValidators.required(),
        Validators.required,
      ]),
      code: new FormControl<number>(3456, [
        RxwebValidators.required(),
        Validators.required,
        RxwebValidators.numeric()
      ])
    }, {
      validator: this.formValidationService.checkPasswords,
    });
  }

  submit(): void {
    if (this.resetPassForm.invalid) {
      console.log(this.resetPassForm.controls.confirmPassword)
      return;
    }
    const {email, password, code} = this.resetPassForm.value;
    this.store.resetPassword({
      email,
      password,
      code,
    });
  }

}
