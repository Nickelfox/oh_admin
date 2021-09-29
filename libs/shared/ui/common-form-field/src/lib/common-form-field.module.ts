import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormFieldComponent } from './common-form-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
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
