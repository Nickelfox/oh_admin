import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ChartColor, ChartDatasets, ChartLabel, ChartOptions } from '@rinminase/ng-charts';

@Component({
  selector: 'hidden-innovation-common-line-chart',
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
  styleUrls: ['./common-line-chart.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonLineChartComponent {

  chartOptions: ChartOptions = {
    resizeDelay: 300,
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
      borderColor: '#394155',
      pointBackgroundColor: '#eef9be',
      pointBorderColor: '#e7f6a7',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#394155'
    }
  ];

  chartLegend = false;

  @Input() chartLabels: ChartLabel[] = [];
  @Input() chartData: ChartDatasets = [];
  @Input() label?: string;
  @Input() icon?: string;

}
