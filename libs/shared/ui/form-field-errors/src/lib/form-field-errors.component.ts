import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormValidationService, GenericErrorMessage } from '@hidden-innovation/shared/form-config';

@Component({
  selector: 'hidden-innovation-form-field-errors',
  template: `
    <ng-container *ngIf='error?.required || error?.notEmpty'>
      {{label}} {{errorMessage.required}} <br>
    </ng-container>
    <ng-container *ngIf='error?.invalid || error?.numeric'>
      {{errorMessage.invalid}} <br>
    </ng-container>
    <ng-container *ngIf='error?.hexColor'>
      {{errorMessage.invalid}} <br>
    </ng-container>
    <ng-container *ngIf='(error?.alpha || error?.pattern)'>
      {{errorMessage.invalid}} <br>
    </ng-container>
    <ng-container *ngIf='error?.maxLength'>
      Must not exceed {{error?.maxLength?.refValues[1]}} character limit <br>
    </ng-container>
    <ng-container *ngIf='error?.minlength'>
      Must be greater than {{error?.minlength?.requiredLength}} characters <br>
    </ng-container>
    <ng-container *ngIf='error?.min'>
      Invalid! Must be greater than {{error?.min?.min}} <br>
    </ng-container>
    <ng-container *ngIf='error?.upperCase && !error?.invalid'>
      {{label}} must be is uppercase only <br>
    </ng-container>
    <ng-container *ngIf='error?.email'>
      {{errorMessage.invalid}} <br>
    </ng-container>
    <ng-container *ngIf='error?.alphaNumeric'>
      Must not contain any special character. <br>
    </ng-container>
    <ng-container *ngIf='error?.unique'>
      Must be an unique field <br>
    </ng-container>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldErrorsComponent {
  @Input() error: any;
  @Input() label? = '';
  @Input() errorMessage: Partial<GenericErrorMessage> = this.formValidationService.fieldValidationMessage;

  constructor(
    public formValidationService: FormValidationService
  ) {
  }

}
