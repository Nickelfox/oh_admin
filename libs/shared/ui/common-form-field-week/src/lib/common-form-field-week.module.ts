import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormFieldWeekComponent } from './common-form-field-week.component';
import { MaterialModule } from '@hidden-innovation/material';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [
    CommonFormFieldWeekComponent
  ],
  exports: [
    CommonFormFieldWeekComponent
  ]
})
export class CommonFormFieldWeekModule {}
