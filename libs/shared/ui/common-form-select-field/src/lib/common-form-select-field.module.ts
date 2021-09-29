import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormSelectFieldComponent } from './common-form-select-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  declarations: [
    CommonFormSelectFieldComponent
  ],
  exports: [
    CommonFormSelectFieldComponent
  ]
})
export class CommonFormSelectFieldModule {}
