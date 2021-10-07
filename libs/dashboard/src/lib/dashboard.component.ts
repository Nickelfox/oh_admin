import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartColor, ChartDatasets, ChartLabel, ChartOptions } from '@rinminase/ng-charts';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'oh-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DashboardComponent {
  chartData: ChartDatasets = [
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series A' }

  ];
  chartLabels: ChartLabel[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July'
  ];

  chartOptions: ChartOptions = {
    elements: {
      line: {
        tension: 0,
        borderWidth: 4
      },
      point: {
        pointStyle: 'circle',
        borderWidth: 2,
        radius: 4
      }
    },
    responsive: true,
    maintainAspectRatio: true,
    // legend: {
    //   labels: {
    //     padding: 40
    //   },
    //   display: true,
    //   align: 'start',
    //   position: 'top'
    // },
    layout: {
      padding: 0,
    },
    scales: {
      // yAxes: [{
      //   ticks: {
      //     beginAtZero: true
      //   }
      // }]
    }
  };

  chartColors: ChartColor = [
    {
      backgroundColor: 'transparent',
      borderColor: '#394155',
      pointBackgroundColor: '#eef9be',
      pointBorderColor: '#e7f6a7',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(33, 150, 243, 1)'
    }

  ];
  chartLegend = true;

  constructor(
    public store: DashboardStore
  ) {
  }
}
