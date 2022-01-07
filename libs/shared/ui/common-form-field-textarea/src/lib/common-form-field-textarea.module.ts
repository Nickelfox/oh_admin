import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormFieldTextareaComponent } from './common-form-field-textarea.component';
import { MaterialModule } from '@hidden-innovation/material';
import { FormFieldErrorsModule } from '@hidden-innovation/shared/ui/form-field-errors';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormFieldErrorsModule
  ],
  declarations: [
    CommonFormFieldTextareaComponent
  ],
  exports: [
    CommonFormFieldTextareaComponent
  ]
})
export class CommonFormFieldTextareaModule {}
