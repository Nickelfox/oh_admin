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
export class DashboardUserDemographicComponent {

  colors = {
    male: '#367AEC',
    female: '#CADF6E',
    other: '#2D3753',
  };

  @Input() maleBarData: ChartDatasets | null = [];
  @Input() femaleBarData: ChartDatasets | null = [];
  @Input() nonBinaryBarData: ChartDatasets | null = [];
  @Input() overallOptimalScore: ChartDatasets | null = [];
  @Input() ratioChartData: SingleOrMultiDataSet | null = [];
  @Input() isLoading: boolean | null = false;
  public malePercentage = 0;
  public femalePercentage = 0;
  public nonBinaryPercentage = 0;
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
        this.colors.male,
        this.colors.female,
        this.colors.other
      ]
    }
  ];

  ageLabels: ChartLabel[] = [
    '18-24',
    '25-34',
    '35-44',
    '45+'
  ];

  optimalScoreLables: ChartLabel[]  = [
    'Strength',
    'Function',
    'Mobility',
    'Cardio',
    'Lifestyle'
  ]

  doughnutChartLabel: ChartLabel[] = [
    'Male',
    'Female',
    'Transgender'
  ];

  doughnutPlugins = [this.doughnutChartLabel];



  chartOptionsFemale: ChartOptions = {
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
      text: 'Female',
      fontColor: '#394155',
      fontSize: 10,
      padding: 4,
    },
    tooltips:{
      callbacks:{
        label: (tooltipItem, data):any => {
          // @ts-ignore
          const value = data.datasets[0].data[tooltipItem.index];
          // @ts-ignore
          return `Female: ${value}`;
        }
      }
    },
    scales:{
      yAxes:[{
        ticks:{
          stepSize:10,
          fontSize:10,

        }
      }]
    }
  };
  chartOptionsMale: ChartOptions = {
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
      text: 'Male',
      fontColor: '#394155',
      fontSize: 10,
      padding: 4,
    },
    tooltips:{
      callbacks:{
        label: (tooltipItem, data):any => {
          // @ts-ignore
          const value = data.datasets[0].data[tooltipItem.index];
          // @ts-ignore
          return `Male: ${value}`;
        }
      }
    },
    scales:{
      yAxes:[{
        ticks:{
          stepSize:10,
          fontSize:10,

        }
      }]
    }
  };
  chartOptionsBinary: ChartOptions = {
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
      text: 'Transgender',
      fontColor: '#394155',
      fontSize: 10,
      padding: 4,
    },
    tooltips:{
      callbacks:{
        label: (tooltipItem, data):any => {
          // @ts-ignore
          const value = data.datasets[0].data[tooltipItem.index];
          // @ts-ignore
          return `Transgender: ${value}`;
        }
      }
    },
    scales:{
      yAxes:[{
        ticks:{
          stepSize:15,
          fontSize:10,

        }
      }]
    }
  };
  chartOptionsOptimalScore: ChartOptions = {
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
      text: 'Score',
      fontColor: '#394155',
      fontSize: 10,
      padding: 4,
    },
    tooltips:{
      callbacks:{
        label: (tooltipItem, data):any => {
          // @ts-ignore
          const value = data.datasets[0].data[tooltipItem.index];
          // @ts-ignore
          return `Score: ${value}`;
        }
      }
    },
    scales:{
      yAxes:[{
        ticks:{
          stepSize:15,
          fontSize:10,

        }
      }]
    }
  };


  chartOptions: ChartOptions = {

    tooltips:{
      callbacks:{
        label: (tooltipItem, data):any => {
          // @ts-ignore
          const value = data.datasets[0].data[tooltipItem.index];
          // @ts-ignore
          return ` ${data.labels[tooltipItem.index]}: ${value}%`;
        }
      }
    },
    responsive: true,
    maintainAspectRatio: true,

  };


  chartLegend = false;

  ngOnChanges() {
    if (this.ratioChartData) {
      const ratios = this.ratioChartData[0] as number[];
      this.malePercentage = ratios[0] as number;
      this.femalePercentage = ratios[1] as number;
      this.nonBinaryPercentage = ratios[2] as number;
    }
  }
}
