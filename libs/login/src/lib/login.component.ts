import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthFacade, LoginRequest } from '@hidden-innovation/auth';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Validators } from '@angular/forms';
import { FormValidationService } from '@hidden-innovation/shared/form-config';

@Component({
  selector: 'hidden-innovation-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  loginForm: FormGroup<LoginRequest> = new FormGroup<LoginRequest>({
    email: new FormControl<string>('', [
      RxwebValidators.email(),
      RxwebValidators.required(),
      Validators.required
    ]),
    password: new FormControl<string>('', [
      RxwebValidators.required()
    ])
  });

  passwordHidden = true;

  constructor(
    public authFacade: AuthFacade,
    public formValidationService: FormValidationService
  ) {
  }

  submit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.authFacade.login(this.loginForm.value);
  }

}
