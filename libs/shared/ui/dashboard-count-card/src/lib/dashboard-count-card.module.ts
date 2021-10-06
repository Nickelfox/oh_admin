import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardCountCardComponent } from './dashboard-count-card.component';
import { MaterialModule } from '@hidden-innovation/material';
import { UtilsModule } from '@hidden-innovation/shared/utils';

@NgModule({
  imports: [CommonModule, MaterialModule, UtilsModule],
  declarations: [
    DashboardCountCardComponent
  ],
  exports: [
    DashboardCountCardComponent
  ]
})
export class DashboardCountCardModule {}
