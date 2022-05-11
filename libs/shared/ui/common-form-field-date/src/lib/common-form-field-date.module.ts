import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormFieldDateComponent } from './common-form-field-date.component';
import { MaterialModule } from '@hidden-innovation/material';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [
    CommonFormFieldDateComponent
  ],
  exports: [
    CommonFormFieldDateComponent
  ]
})
export class CommonFormFieldDateModule {}
