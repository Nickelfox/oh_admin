import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormFieldDateRangeComponent } from './common-form-field-date-range.component';
import { MaterialModule } from '@hidden-innovation/material';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [
    CommonFormFieldDateRangeComponent
  ],
  exports: [
    CommonFormFieldDateRangeComponent
  ]
})
export class CommonFormFieldDateRangeModule {}
