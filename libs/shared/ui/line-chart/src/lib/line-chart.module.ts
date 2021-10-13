import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartComponent } from './line-chart.component';
import { ChartsModule } from '@rinminase/ng-charts';
import { MaterialModule } from '@hidden-innovation/material';

@NgModule({
  imports: [CommonModule, ChartsModule, MaterialModule],
  declarations: [
    LineChartComponent
  ],
  exports: [
    LineChartComponent
  ]
})
export class LineChartModule {}
