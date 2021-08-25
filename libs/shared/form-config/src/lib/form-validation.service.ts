import { Injectable } from '@angular/core';
import { GenericErrorMessage } from './models/form-error-message.interface';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  emailValidationMessage: GenericErrorMessage = {
    required: 'Email is required',
    invalid: 'Invalid Email! Enter a valid Email Address'
  };

  passwordValidationMessage: GenericErrorMessage = {
    required: 'Password is required',
    invalid: 'Invalid Password! Must contain a uppercase, lowercase, number and min length of 8',
    mismatch: 'Passwords does not match'
  };


  constructor() {
  }
}
