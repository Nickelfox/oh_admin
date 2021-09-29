import { Injectable } from '@angular/core';
import { GenericErrorMessage } from './models/form-error-message.interface';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { FormGroup } from '@ngneat/reactive-forms';
import { ValidationErrors } from '@ngneat/reactive-forms/lib/types';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  public readonly FIELD_VALIDATION_VALUES = {
    NAME_LENGTH: 45,
    USERNAME_LENGTH: 30
  };

  fieldValidationMessage: Partial<GenericErrorMessage> = {
    required: 'field is required',
    invalid: 'Must not contain any special character or number',
    maxLength: `Must not exceed 150 character limit`
  };

  emailValidationMessage: Partial<GenericErrorMessage> = {
    required: 'field is required',
    invalid: 'Invalid Email! Enter a valid Email Address'
  };

  passwordValidationMessage: Partial<GenericErrorMessage> = {
    required: 'Password is required',
    invalid: 'Invalid Password! Must contain a uppercase, lowercase, number and min length of 8',
    mismatch: 'Passwords does not match'
  };

  numericValidationMessage: Partial<GenericErrorMessage> = {
    required: 'field is required',
    invalid: 'Invalid! Must be a number without any special character'
  };

  hexValidationMessage: Partial<GenericErrorMessage> = {
    required: 'field is required',
    invalid: 'Invalid! Must be a HEX color code'
  };

  // public  readonly nameRegex = {onlyAlpha: /^[A-Za-z]+$/};

  // private readonly passwordRegex: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
  // Updated regex not allowing white space now
  readonly fieldRegex: RegExp = /^[^\s]+(\s+[^\s]+)*$/;
  // Reference: https://regex101.com/r/0bH043/1
  private readonly passwordRegex: RegExp = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,}$/gm;

  get validPassword(): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp(this.passwordRegex);
      const valid = regex.test(control.value);
      return valid ? null : { invalid: true };
    };
  }

  noWhiteSpace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if ((control.value as string).indexOf('  ') >= 0) {
        return { noWhiteSpace: true };
      }
      return null;
    };
  }

  // Return FormGroup validator function to match both password fields
  checkPasswords(pasName = 'password', conPasName = 'confirmPassword'): ValidatorFn {
    return (group: AbstractControl) => {
      if (!group) {
        return null;
      }
      const pass: string = group.get(pasName)?.value;
      const confirmPass: string = group.get(conPasName)?.value;
      if (pass !== confirmPass) {
        group.get(conPasName)?.setErrors({ notSame: true });
        return null;
      }
      group.get(conPasName)?.setErrors(null);
      return null;
    };
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
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }
}

