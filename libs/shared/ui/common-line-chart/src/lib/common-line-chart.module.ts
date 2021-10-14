import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonLineChartComponent } from './common-line-chart.component';
import { MaterialModule } from '@hidden-innovation/material';
import { ChartsModule } from '@rinminase/ng-charts';

@NgModule({
  imports: [CommonModule, MaterialModule, ChartsModule],
  exports: [
    CommonLineChartComponent
  ],
  declarations: [
    CommonLineChartComponent
  ]
})
export class CommonLineChartModule {
}
