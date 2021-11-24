import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortingHeaderDateComponent } from './sorting-header-date.component';
import { MaterialModule } from '@hidden-innovation/material';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule

  ],
  declarations: [
    SortingHeaderDateComponent
  ],
  exports: [
    SortingHeaderDateComponent
  ]
})
export class SortingHeaderDateModule {}
