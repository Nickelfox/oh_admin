import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
// import {AuthFacade} from "../state/auth.facade";
import {Validators} from "@angular/forms";
import {FormValidationService} from "@hidden-innovation/shared/form-config";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {FormControl, FormGroup} from "@ngneat/reactive-forms";
import { AuthFacade } from '@hidden-innovation/auth';

@Component({
  selector: 'hidden-innovation-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', [
      RxwebValidators.email(),
      RxwebValidators.required(),
      Validators.required
    ]),
  });


  constructor(
    public authFacade: AuthFacade,
    public formValidationService: FormValidationService
  ) { }

  ngOnInit(): void {
    console.log("hello password")
  }

}
