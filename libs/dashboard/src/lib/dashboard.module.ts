import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '@hidden-innovation/material';
import { DashboardStore } from './dashboard.store';
import { DashboardService } from './services/dashboard.service';
import { DashboardCountCardModule } from '@hidden-innovation/shared/ui/dashboard-count-card';
import { CommonFormFieldDateRangeModule } from '@hidden-innovation/shared/ui/common-form-field-date-range';
import { CommonFormFieldWeekModule } from '@hidden-innovation/shared/ui/common-form-field-week';
import { CommonFormFieldDateModule } from '@hidden-innovation/shared/ui/common-form-field-date';
import { CommonFormFieldMonthModule } from '@hidden-innovation/shared/ui/common-form-field-month';
import { DashboardUserDemographicModule } from '@hidden-innovation/shared/ui/dashboard-user-demographic';
import { LineChartModule } from '@hidden-innovation/shared/ui/line-chart';

import { ChartsModule } from '@rinminase/ng-charts';
// import {AuthGuard} from "@hidden-innovation/auth";

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    MaterialModule,
    DashboardCountCardModule,
    LineChartModule,
    DashboardUserDemographicModule,
    CommonFormFieldDateRangeModule,
    CommonFormFieldWeekModule,
    CommonFormFieldDateModule,
    CommonFormFieldMonthModule,
    ChartsModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        // canActivate: [AuthGuard],
        component: DashboardComponent
      }
    ])
  ],
  providers: [
    DashboardService,
    DashboardStore]
})
export class DashboardModule {
}
