import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ChartColor, ChartDatasets, ChartLabel, ChartOptions, SingleOrMultiDataSet } from '@rinminase/ng-charts';
import { BehaviorSubject, Observable } from "rxjs";

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
    female: '#CADF6E',
    other: '#2D3753',
  };

  @Input() maleBarData: ChartDatasets | null = [];
  @Input() femaleBarData: ChartDatasets | null = [];
  @Input() nonBinaryBarData: ChartDatasets | null = [];
  @Input() ratioChartData: SingleOrMultiDataSet | null = [];
  public malePercentage: number = 0;
  public femalePercentage: number = 0;
  public nonBinaryPercentage: number = 0;
  femaleAgeBarColor: ChartColor = [
    {
      backgroundColor: this.colors.female
    }
  ];
  nonBinaryAgeBarColor: ChartColor = [
    {
      backgroundColor: this.colors.other
    }
  ];
  maleAgeBarColor: ChartColor = [
    {
      backgroundColor: this.colors.male
    }
  ];
  otherAgeBarColor: ChartColor = [
    {
      backgroundColor: this.colors.other
    }
  ];
  doughnutChartColor: ChartColor = [
    {
      backgroundColor: [
        this.colors.female,
        this.colors.male,
        this.colors.other
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
    'Male',
    'Other'
  ];

  doughnutPlugins = [this.doughnutChartLabel];

  chartOptions: ChartOptions = {
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
    maintainAspectRatio: true,
    title: {
      display: true,
      position: 'left',
      text: 'No. Of Users',
      fontColor: '#394155',
      fontSize: 10,
      padding: 4,
    },
  };

  chartLegend = false;

  public ngOnInit() {
    console.log(this.femaleBarData)
  }

  ngOnChanges() {
    if (this.ratioChartData) {
      console.log(this.ratioChartData)
      const ratios = this.ratioChartData[0] as number[];
      this.malePercentage = ratios[0] as number;
      this.femalePercentage = ratios[1] as number;
      this.nonBinaryPercentage = ratios[2] as number;
    }
  }
}
