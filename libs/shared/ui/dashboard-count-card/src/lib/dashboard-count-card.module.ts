import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardCountCardComponent } from './dashboard-count-card.component';
import { MaterialModule } from '@hidden-innovation/material';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { ShimmerModule } from '@hidden-innovation/shared/ui/shimmer';

@NgModule({
  imports: [CommonModule, MaterialModule, ShimmerModule, UtilsModule],
  declarations: [
    DashboardCountCardComponent
  ],
  exports: [
    DashboardCountCardComponent
  ]
})
export class DashboardCountCardModule {}
