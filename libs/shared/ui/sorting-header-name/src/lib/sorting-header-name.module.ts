import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortingHeaderNameComponent } from './sorting-header-name.component';
import { MaterialModule } from '@hidden-innovation/material';
import { UtilsModule } from '@hidden-innovation/shared/utils';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    UtilsModule
  ],
  declarations: [
    SortingHeaderNameComponent
  ],
  exports: [
    SortingHeaderNameComponent
  ]
})
export class SortingHeaderNameModule {}
