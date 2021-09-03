import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@ngneat/reactive-forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {Validators} from "@angular/forms";
import {FormValidationService} from "@hidden-innovation/shared/form-config";
import {ChangePasswordRequest} from './models/change-password.interface';
import {ChangePasswordStore} from "./change-password.store";


@Component({
  selector: 'hidden-innovation-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {

  changePassForm: FormGroup<ChangePasswordRequest>;

  passwordHidden = {
    oldPass: true,
    newPass: true,
    confPass: true
  }

  constructor(
    public formValidationService: FormValidationService,
    private fb: FormBuilder,
    public store: ChangePasswordStore,
  ) {
    this.changePassForm = this.fb.group<ChangePasswordRequest>({
      password: new FormControl<string>('', [
        RxwebValidators.required(),
        Validators.required,
        this.formValidationService.validPassword
      ]),
      passwordNew: new FormControl<string>('', [
        RxwebValidators.required(),
        Validators.required,
        this.formValidationService.validPassword
      ]),
      passwordConfirm: new FormControl<string>('', [
        RxwebValidators.required(),
        Validators.required
      ]),
    }, {
      validator: this.formValidationService.checkPasswords('passwordNew', 'passwordConfirm'),
    });
  }

  submit(): void {
    if (this.changePassForm.invalid) {
      return;
    }
    this.store.changePassword(this.changePassForm.value);
  }

}
