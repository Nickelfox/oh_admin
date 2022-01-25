import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardUserDemographicComponent } from './dashboard-user-demographic.component';
import { MaterialModule } from '@hidden-innovation/material';
import { ChartsModule } from '@rinminase/ng-charts';
import { ShimmerModule } from '@hidden-innovation/shared/ui/shimmer';

@NgModule({
  imports: [CommonModule, MaterialModule, ChartsModule, ShimmerModule],
  exports: [
    DashboardUserDemographicComponent
  ],
  declarations: [
    DashboardUserDemographicComponent
  ]
})
export class DashboardUserDemographicModule {
}
