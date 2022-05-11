import { Injectable } from '@angular/core';
import { GenericErrorMessage } from './models/form-error-message.interface';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { ValidationErrors } from '@ngneat/reactive-forms/lib/types';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { DateTime } from 'luxon';
import { PointTypeEnum, RepsCore } from '@hidden-innovation/shared/models';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  public readonly FIELD_VALIDATION_VALUES = {
    NAME_LENGTH: 45,
    SUB_TITLE_LENGTH: 100,
    PACK_NAME_LENGTH: 40,
    USERNAME_LENGTH: 30,
    QUESTION_NAME_LENGTH: 65,
    QUESTION_DESC_LENGTH: 200,
    ANSWER_LENGTH: 50,
    SPOTLIGHT_BUTTON_LENGTH: 30,
    ASSESSMENT_ABOUT_LENGTH: 200
  };

  fieldValidationMessage: Partial<GenericErrorMessage> = {
    required: 'field is required',
    invalid: 'Must not contain any special character or number',
    maxLength: `Must not exceed 150 character limit`
  };

  lockOutValidationMessage: Partial<GenericErrorMessage> = {
    required: 'field is required',
    invalid: 'Must not contain any special character or negative value',
    minLength: `Must  be greater than zero`
  };

  pointsValidationMessage: Partial<GenericErrorMessage> = {
    required: 'Point field is required',
    invalid: 'Only numeric & non-floating point values allowed',
    highField: 'Must be higher than the low field value',
    lowField: 'Must be less than the low field value'
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

  questionValidationMessage: Partial<GenericErrorMessage> = {
    minLength: 'Minimum of 2 questions are required to create a questionnaire'
  };

  answerValidationMessage: Partial<GenericErrorMessage> = {
    minLength: 'Minimum of 2 answers are required to create a question'
  };

  testSelectionValidationMessage: Partial<GenericErrorMessage> = {
    minLength: 'Minimum of 2 tests are required to save a test group'
  };

  contentSelectionValidationMessage: Partial<GenericErrorMessage> = {
    minLength: 'Minimum of 2 contents are required to save a pack'
  };

  formSubmitError = 'Invalid Submission! Please fill all valid details';

  // public  readonly nameRegex = {onlyAlpha: /^[A-Za-z]+$/};

  // private readonly passwordRegex: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
  // Updated regex not allowing white space now
  readonly fieldRegex: RegExp = /^[^\s]+(\s+[^\s]+)*$/;
  nameValidations = [
    RxwebValidators.required(),
    RxwebValidators.notEmpty(),
    RxwebValidators.alpha({
      allowWhiteSpace: true
    }),
    RxwebValidators.maxLength({
      value: this.FIELD_VALIDATION_VALUES.NAME_LENGTH
    }),
    Validators.pattern(this.fieldRegex)
  ];
  pointValidations = [
    RxwebValidators.required(),
    RxwebValidators.numeric({
      allowDecimal: false,
      acceptValue: NumericValueType.Both
    })
  ];
  requiredFieldValidation: ValidatorFn[] = [
    RxwebValidators.required(),
    RxwebValidators.notEmpty()
  ];
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

  greaterPointValidator(inverse?: boolean): ValidatorFn {
    return (arr: AbstractControl) => {
      if (!arr) {
        return null;
      }
      const errors: any = {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const controls = arr.controls;
      for (let i = 1; i < controls.length; i++) {
        const previousValueControl = controls[i - 1].controls.high as FormControl<number>;
        const valueControl = controls[i].controls.low as FormControl<number>;
        // if error, set array error
        if (!inverse ? (previousValueControl.value >= valueControl.value) : (previousValueControl.value <= valueControl.value)) {
          // array error (sum up of all errors)
          errors[(i - 1) + (!inverse ? 'lessThan' : 'highThan') + (i)] = true;
        }
      }
      // return array errors ({} is considered an error so return null if it is the case)
      return errors;
    };
  }

  greaterTimeValidator(inverse?: boolean): ValidatorFn {
    return (arr: AbstractControl) => {
      if (!arr) {
        return null;
      }
      const errors: any = {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const controls = arr.controls;
      for (let i = 1; i < controls.length; i++) {
        const previousValueControl = controls[i - 1].controls.high as FormControl<Date>;
        const valueControl = controls[i].controls.low as FormControl<Date>;
        const prevVal = DateTime.fromJSDate(previousValueControl.value).toSeconds();
        const currVal = DateTime.fromJSDate(valueControl.value).toSeconds();
        // if error, set array error
        if (!inverse ? Math.round(prevVal) >= Math.round(currVal) : Math.round(prevVal) <= Math.round(currVal)) {
          // array error (sum up of all errors)
          errors[(i - 1) + (!inverse ? 'lessThan' : 'highThan') + (i)] = true;
        }
      }
      // return array errors ({} is considered an error so return null if it is the case)
      return errors;
    };
  }

  greaterLowHigh(inverse?: boolean): ValidatorFn {
    return (group: AbstractControl) => {
      if (!group) {
        return null;
      }
      const low: FormControl = group.get('low') as FormControl;
      const high: FormControl = group.get('high') as FormControl;
      const pointType: FormControl = group.get('pointType') as FormControl;
      switch (pointType.value) {
        case PointTypeEnum.HP:
          if (low !== null && low !== undefined && high !== null && high !== undefined && low.value !== high.value) {
            low?.setErrors({ notEqual: true });
            high?.setErrors({ notEqual: true });
            return null;
          }
          low?.removeError('notEqual');
          high?.removeError('notEqual');
          return null;
        default:
          if (low !== null && low !== undefined && high !== null && high !== undefined && (!inverse ? (low.value > high.value) : (low.value < high.value))) {
            low?.setErrors(!inverse ? { highThan: true } : { lessThan: true });
            high?.setErrors(!inverse ? { lessThan: true } : { highThan: true });
            return null;
          }
          low?.removeError('highThan');
          low?.removeError('lessThan');
          high?.removeError('lessThan');
          high?.removeError('highThan');
          return null;
      }
    };
  }

  greaterTimeLowHigh(inverse?: boolean): ValidatorFn {
    return (group: AbstractControl) => {
      if (!group) {
        return null;
      }
      const low: FormControl = group.get('low') as FormControl<Date>;
      const high: FormControl = group.get('high') as FormControl<Date>;
      const pointType: FormControl = group.get('pointType') as FormControl;
      switch (pointType.value) {
        case PointTypeEnum.HP:
          if (low !== null && low !== undefined && high !== null && high !== undefined) {
            const lowVal = DateTime.fromJSDate(low.value).toSeconds();
            const highVal = DateTime.fromJSDate(high.value).toSeconds();
            if (Math.round(lowVal) === Math.round(highVal)) {
              low?.setErrors({ notEqual: true });
              high?.setErrors({ notEqual: true });
              return null;
            }
            low?.removeError('notEqual');
            high?.removeError('notEqual');
            return null;
          }
          low?.removeError('notEqual');
          high?.removeError('notEqual');
          return null;
        default:
          if (low !== null && low !== undefined && high !== null && high !== undefined) {
            const lowVal = DateTime.fromJSDate(low.value).toSeconds();
            const highVal = DateTime.fromJSDate(high.value).toSeconds();
            if (!inverse ? (Math.round(lowVal) > Math.round(highVal)) : (Math.round(lowVal) < Math.round(highVal))) {
              low?.setErrors({ highThan: true });
              high?.setErrors({ lessThan: true });
              return null;
            }
            low?.removeError('highThan');
            high?.removeError('lessThan');
            return null;
          }
          low?.removeError('highThan');
          high?.removeError('lessThan');
          return null;
      }
    };
  }

  minOneTrue(): ValidatorFn {
    return (group: AbstractControl) => {
      try {
        if (!group || group.disabled) {
          return null;
        }
        const errors: any = {};
        const repsGroup: FormGroup<RepsCore> = group as FormGroup<RepsCore>;
        let toggleCount = 0;
        toggleCount += repsGroup?.value?.oneRep ? 1 : 0;
        toggleCount += repsGroup?.value?.threeRep ? 1 : 0;
        toggleCount += repsGroup?.value?.fiveRep ? 1 : 0;
        if (toggleCount < 1) {
          errors['minOneTrue'] = true;
        }
        return errors;
      } catch {
        return null;
      }
    };
  }
}
