import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormFieldNumberComponent } from './common-form-field-number.component';
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
    CommonFormFieldNumberComponent
  ],
  exports: [
    CommonFormFieldNumberComponent
  ]
})
export class CommonFormFieldNumberModule {}
