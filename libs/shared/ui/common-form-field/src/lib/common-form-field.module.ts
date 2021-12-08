import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormFieldComponent } from './common-form-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FormFieldErrorsModule } from '@hidden-innovation/shared/ui/form-field-errors';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormFieldErrorsModule,
  ],
  declarations: [
    CommonFormFieldComponent
  ],
  exports: [
    CommonFormFieldComponent
  ]
})
export class CommonFormFieldModule {
}
