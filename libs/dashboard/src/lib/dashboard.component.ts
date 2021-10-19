import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartColor, ChartDatasets, ChartLabel, ChartOptions, SingleOrMultiDataSet } from '@rinminase/ng-charts';
import { DashboardStore } from './dashboard.store';
import { DashboardRangeFilterEnum } from '@hidden-innovation/shared/models';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { DashboardRequest } from './models/dashboard.interface';
import { Validators } from '@angular/forms';
import { DateTime } from 'luxon';
import { UntilDestroy } from '@ngneat/until-destroy';
import { tap } from 'rxjs/operators';

@UntilDestroy({ checkProperties: true })
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

  femaleData: ChartDatasets = [
    { data: [25, 59, 13, 3], label: 'Female' }
  ];
  maleData: ChartDatasets = [
    { data: [12, 53, 26, 8, 0], label: 'Male' }
  ];

  ageRatioData: SingleOrMultiDataSet = [
    [60, 40],
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


  colors = {
    cardio: '#3297E0',
    strength: '#4EBC9C',
    function: '#394155',
    test1:'#394155',
    test2:'#3297E0',
    test3:'#9C5AB6',
    test4:'#BFC4C8',
    test5:'#CADF6E',
    test6:'#54DBDF',
  };

  doughnutChartColorTest: ChartColor = [
    {
      backgroundColor: [
        this.colors.cardio,
        this.colors.strength,
        this.colors.function
      ]
    }
  ];
  doughnutChartLabelTest: ChartLabel[] = [
    'Cardio',
    'Strength',
    'Funtion'
  ];
  assestTest: SingleOrMultiDataSet = [
    [20,20,20]
  ]
  doughnutPlugins = [this.doughnutChartLabelTest];

  // Complete Test
  doughnutChartColorComplete: ChartColor = [
    {
      backgroundColor: [
        this.colors.test1,
        this.colors.test2,
        this.colors.test3,
        this.colors.test4,
        this.colors.test5,
        this.colors.test6,
      ]
    }
  ];
  doughnutChartLabelComplete: ChartLabel[] = [
    'Test 1',
    'Test 2',
    'Test 3',
    'Test 4',
    'Test 5',
    'Test 6',
  ];
  completeTest: SingleOrMultiDataSet = [
    [10,20,30,50,70,20]
  ]
  doughnutPluginsComplete = [this.doughnutChartLabelComplete];

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
    maintainAspectRatio: true
  };

  chartLegendTest = false;
  chartLegendComplete = false;

  

  dashboardRangeTypes: string[] = Object.keys(DashboardRangeFilterEnum);
  dashboardRangeFilterEnum = DashboardRangeFilterEnum;

  rangeFilterGroup: FormGroup<DashboardRequest> = new FormGroup<DashboardRequest>({
    type: new FormControl<DashboardRangeFilterEnum>(DashboardRangeFilterEnum.WEEKLY),
    start: new FormControl<string>('', [
      Validators.required
    ]),
    end: new FormControl<string>('', [
      Validators.required
    ])
  });

  maxDate = DateTime.now();

  constructor(
    public store: DashboardStore
  ) {
    this.rangeFilterGroup.controls.type.valueChanges.pipe(
      tap((res) => {
        switch (res) {
          case DashboardRangeFilterEnum.WEEKLY:
            this.rangeFilterGroup.patchValue({
              end: '',
              start: ''
            });
            break;
        }
        this.rangeFilterGroup.patchValue({
          end: '',
          start: ''
        });
        this.rangeFilterGroup.markAsUntouched();
      })
    ).subscribe();
  }

  // get calenderView(): 'month' | 'year' | 'multi-year' {
  //   const type: DashboardRangeFilterEnum = this.rangeFilterGroup.controls.type.value;
  //   if (type === DashboardRangeFilterEnum.MONTHLY) {
  //     return 'month';
  //   }
  // }

  submit(): void {
    console.log(this.rangeFilterGroup);
  }
}
