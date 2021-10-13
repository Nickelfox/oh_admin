import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ChartColor, ChartDatasets, ChartLabel, ChartOptions } from '@rinminase/ng-charts';

@Component({
  selector: 'hidden-innovation-dashboard-user-demographic',
  templateUrl: './dashboard-user-demographic.component.html',
  styleUrls: ['./dashboard-user-demographic.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardUserDemographicComponent implements OnInit {

  colors = {
    male: '#367AEC',
    female: '#CADF6E'
  };

  @Input() maleBarData: ChartDatasets = [];
  @Input() femaleBarData: ChartDatasets = [];
  @Input() ratioChartData: ChartDatasets = [];

  femaleAgeBarColor: ChartColor = [
    {
      backgroundColor: this.colors.female
    }
  ];
  maleAgeBarColor: ChartColor = [
    {
      backgroundColor: this.colors.male
    }
  ];
  doughnutChartColor: ChartColor = [
    {
      backgroundColor: [
        this.colors.female,
        this.colors.male
      ]
    }
  ];

  ageLabels: ChartLabel[] = [
    '18-24',
    '25-34',
    '35-44',
    '45-54'
  ];
  doughnutChartLabel: ChartLabel[] = [
    'Female',
    'Male'
  ];

  doughnutPlugins = [this.doughnutChartLabel];
  chartPlugins = [this.ageLabels];

  chartOptions: ChartOptions = {
    resizeDelay: 300,
    layout: {
      padding: 0
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 8
      }
    },
    responsive: true,
    maintainAspectRatio: true
  };

  chartLegend = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
