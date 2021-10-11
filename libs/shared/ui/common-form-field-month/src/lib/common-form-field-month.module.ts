import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormFieldMonthComponent } from './common-form-field-month.component';
import { MaterialModule } from '@hidden-innovation/material';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [
    CommonFormFieldMonthComponent
  ],
  exports: [
    CommonFormFieldMonthComponent
  ]
})
export class CommonFormFieldMonthModule {}
