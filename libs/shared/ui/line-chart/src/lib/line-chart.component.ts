import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ChartColor, ChartDatasets, ChartLabel, ChartOptions } from '@rinminase/ng-charts';

@Component({
  selector: 'hidden-innovation-line-chart',
  template: `
    <mat-card>
      <mat-card-content>
        <div class='d-flex align-items-center mb-3'>
          <mat-icon color='primary' class='mr-1 card-icon'>{{icon || '--'}}</mat-icon>
          <h4 class='mat-h4 mb-0 text-color__primary font-calibri'>{{label || '--'}}</h4>
        </div>
        <canvas baseChart
                chartType='line'
                [colors]='chartColors'
                [datasets]='chartData'
                [labels]='chartLabels'
                [legend]='chartLegend'
                [options]='chartOptions'>
        </canvas>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./line-chart.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent {
  chartOptions: ChartOptions = {
    layout: {
      padding: 0
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 3
      },
      point: {
        pointStyle: 'circle',
        radius: 4,
        hoverRadius: 8
      }
    },
    responsive: true,
    maintainAspectRatio: true
  };

  chartColors: ChartColor = [
    {
      backgroundColor: 'transparent',
      borderColor: '#CADF6E ',
      pointBackgroundColor: '#367AEC',
      pointBorderColor: '#CADF6E',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#367AEC'
    }
  ];

  chartLegend = false;

  @Input() chartLabels: ChartLabel[] = [];
  @Input() chartData: ChartDatasets = [];
  @Input() label?: string;
  @Input() icon?: string;

}
