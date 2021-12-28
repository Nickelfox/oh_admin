import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackContentCardComponent } from './pack-content-card.component';
import { MaterialModule } from '@hidden-innovation/material';
import { UtilsModule } from '@hidden-innovation/shared/utils';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    UtilsModule
  ],
  declarations: [
    PackContentCardComponent
  ],
  exports: [
    PackContentCardComponent
  ]
})
export class PackContentCardModule {}
