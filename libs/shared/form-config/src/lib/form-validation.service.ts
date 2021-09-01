import {Injectable} from '@angular/core';
import {GenericErrorMessage} from './models/form-error-message.interface';
import {AbstractControl, ValidatorFn} from "@angular/forms";
import {FormGroup} from "@ngneat/reactive-forms";

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  fieldValidationMessage: GenericErrorMessage = {
    required: 'field is required',
    invalid: 'Must not contain any special character or number',
    maxLength: 'Must not exceed 150 character limit',
  };

  emailValidationMessage: GenericErrorMessage = {
    required: 'Email is required',
    invalid: 'Invalid Email! Enter a valid Email Address'
  };

  passwordValidationMessage: GenericErrorMessage = {
    required: 'Password is required',
    invalid: 'Invalid Password! Must contain a uppercase, lowercase, number and min length of 8',
    mismatch: 'Passwords does not match'
  };

  private readonly passwordRegex: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

  get validPassword(): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp(this.passwordRegex);
      const valid = regex.test(control.value);
      return valid ? null : {invalid: true};
    };
  }

  // Return FormGroup validator function to match both password fields

  checkPasswords(pasName = 'password', conPasName = 'confirmPassword'): ValidatorFn {
    return (group: AbstractControl) => {
      if (!group) {
        return null;
      }
      const pass = group.get(pasName)?.value;
      const confirmPass = group.get(conPasName)?.value;
      if (pass === confirmPass) {
        return null;
      } else {
        group.get(conPasName)?.setErrors({notSame: true});
      }
      return null;
    }
  }

  // tslint:disable-next-line:typedef
  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({passwordMismatch: true});
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }
}

