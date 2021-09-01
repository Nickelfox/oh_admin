import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@ngneat/reactive-forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {Validators} from "@angular/forms";
import {FormValidationService} from "@hidden-innovation/shared/form-config";
import {ChangePassword} from './models/change-password.interface';


@Component({
  selector: 'hidden-innovation-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit {


  changePassForm: FormGroup<ChangePassword> ;

  passwordHidden = {
    oldPass: true,
    newPass:true,
    confPass: true
  }

  constructor(
    public formValidationService: FormValidationService,
    private fb: FormBuilder
  ) {
    this.changePassForm = this.fb.group<ChangePassword>({
      oldPassword: new FormControl<string>('', [
        RxwebValidators.required(),
        Validators.required,
        this.formValidationService.validPassword
      ]),
      newPassword: new FormControl<string>('', [
        RxwebValidators.required(),
        Validators.required,
        this.formValidationService.validPassword
      ]),
      confirmPassword: new FormControl<string>('', [
        RxwebValidators.required(),
        Validators.required,
        this.formValidationService.validPassword
      ]),
    }, {
      validator: this.formValidationService.checkPasswords,
    });
  }

  submitChangePass()
  {
    console.log("password changed")
  }
  ngOnInit(): void {
    console.log("change password")
  }

}
