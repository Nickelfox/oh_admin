import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldErrorsComponent } from './form-field-errors.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    FormFieldErrorsComponent
  ],
  exports: [
    FormFieldErrorsComponent
  ]
})
export class FormFieldErrorsModule {}
