import { Component } from '@angular/core';
import { ChartColor, ChartDatasets, ChartLabel, ChartOptions, SingleOrMultiDataSet } from '@rinminase/ng-charts';
import { DashboardStore } from './dashboard.store';
import {DashboardRangeFilterEnum, TagCategoryEnum, UserDetails} from '@hidden-innovation/shared/models';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { AssessmentEngagement, DashboardRequest, PackEngagement, TestWatched } from './models/dashboard.interface';
import { Validators } from '@angular/forms';
import { DateTime } from 'luxon';
import { UntilDestroy } from '@ngneat/until-destroy';
import { skip } from 'rxjs/operators';
import {forEach} from "lodash-es";
import {MatTableDataSource} from "@angular/material/table";


export interface AssessmentTestEng {
  position:number;
  name:string;
  id:number;
  score:number;
  completion:string;
}
export interface PackEng {
  position:number;
  name:string;
  id:number;
  totalPlays:number;
  contentClicks:number;
  resourcesClicks:number
}

// export interface TopWatched {
//   position:number;
//   name:string;
//   id:number;
//   videoPlays:number;
//   resultLog:number;
// }

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'oh-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})



export class DashboardComponent {

  _dummyAssessmentTest: AssessmentTestEng[] = [
    {
      position: 1,
      name: 'Strength',
      id: 1,
      score: 20,
      completion: '10%'
    },
  ]

  // _dummyTopWatchedTest: TopWatched[] = [
  //   {
  //     position: 1,
  //     name: 'Short Sprint Test (400m Run)',
  //     id: 32,
  //     videoPlays: 3,
  //     resultLog: 6
  //   },
  // ]

  // _dummyPackEng: PackEng[] = [
  //   {
  //     position: 1,
  //     name: 'Strength',
  //     id: 1,
  //     totalPlays: 20,
  //     contentClicks: 10,
  //     resourcesClicks: 20
  //   }
  // ]

  displayedColumnsAssessmentTest: string[] = ['position', 'name', 'id', 'score', 'completion'];
  assessmentTestTable: MatTableDataSource<AssessmentEngagement> = new MatTableDataSource<AssessmentEngagement>();

  displayedColumnsPackEng: string[] = ['position', 'name', 'id', 'totalPlays', 'contentClicks', 'resourcesClicks'];
  packEngTable: MatTableDataSource<PackEngagement> = new MatTableDataSource<PackEngagement>();

  displayedColumnsTopWatched: string[] = ['position', 'name', 'id', 'videoPlays', 'resultLog'];
  topWatchedTable: MatTableDataSource<TestWatched> = new MatTableDataSource<TestWatched>();



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
    [60, 40]
  ];


  chartLabels: ChartLabel[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  colors: {[key: string]: string} = {
    CARDIO: '#3297E0',
    STRENGTH: '#4EBC9C',
    FUNCTION: '#394155',
    MOBILITY: '#54DBDF',
    LIFESTYLE: '#CADF6E'
  };
  completeTestColors = ['#394155',
    '#3297E0',
    '#9C5AB6',
    '#BFC4C8',
    '#CADF6E',
    '#54DBDF']

  doughnutChartColorTest: ChartColor = [
    {
      backgroundColor: [
        this.colors.CARDIO,
        this.colors.FUNCTION,
        this.colors.STRENGTH,
        this.colors.MOBILE,
        this.colors.LIFESTYLE
      ]
    }
  ];
  doughnutChartLabelTest: ChartLabel[] = [
    ...Object.values(TagCategoryEnum)
  ];
  assestTest: SingleOrMultiDataSet = [
    [20, 20, 20]
  ];
  doughnutPlugins = [this.doughnutChartLabelTest];

  // Complete Test
  doughnutChartColorComplete: ChartColor = [
    {
      backgroundColor: [
        this.completeTestColors[0],
        this.completeTestColors[1],
        this.completeTestColors[2],
        this.completeTestColors[3],
        this.completeTestColors[4],
        this.completeTestColors[5]
      ]
    }
  ];
  doughnutChartLabelComplete: ChartLabel[] = [
    'Test 1',
    'Test 2',
    'Test 3',
    'Test 4',
    'Test 5',
    'Test 6'
  ];
  completeTest: SingleOrMultiDataSet = [
    [10, 20, 30, 50, 70, 20]
  ];
  doughnutPluginsComplete = [this.doughnutChartLabelComplete];



  chartOptionsTest:ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    tooltips:{
     callbacks:{
       label: (tooltipItem, data):any => {
         // @ts-ignore
         const value = data.datasets[0].data[tooltipItem.index];
         // @ts-ignore
         return ` ${data.labels[tooltipItem.index]}: ${value}%`;
       }
     }
    }

  }


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
    start: new FormControl<string>(DateTime.now().minus({
      days: 7
    }).toISODate(), [
      Validators.required
    ]),
    end: new FormControl<string>(DateTime.now().toISODate(), [
      Validators.required
    ])
  });

  maxDate = DateTime.now();




  constructor(
    public store: DashboardStore
  ) {
    this.refreshList();
    this.store.testWatched$.subscribe(res => {
      this.topWatchedTable = new MatTableDataSource<TestWatched>(res)
    });
    this.store.packEngagement$.subscribe(res => {
      this.packEngTable = new MatTableDataSource<PackEngagement>(res)
    });
    this.store.assessmentEng$.subscribe(res => {
      this.assessmentTestTable = new MatTableDataSource<AssessmentEngagement>(res)
    });




    this.store.getStats();
    this.store.getCompleteTestEngagement();
    this.store.getAssessmentTestEngagement();
    this.store.getRegisteredUsers({filterBy: DashboardRangeFilterEnum.WEEKLY, endDate: DateTime.now().toISODate(), startDate: DateTime.now().minus({
        days: 7
      }).toISODate()})
    this.store.getActiveUsers({filterBy: DashboardRangeFilterEnum.WEEKLY, endDate: DateTime.now().toISODate(), startDate: DateTime.now().minus({
        days: 7
      }).toISODate()})
    this.rangeFilterGroup.controls.type.valueChanges.subscribe(res => {
      switch (res) {
        case DashboardRangeFilterEnum.WEEKLY:
          this.rangeFilterGroup.patchValue({
            end: DateTime.now().toISODate(),
            start: DateTime.now().minus({
              days: 7
            }).toISODate()
          });
          this.store.getRegisteredUsers({filterBy: DashboardRangeFilterEnum.WEEKLY, startDate: this.rangeFilterGroup.get('start').value, endDate: this.rangeFilterGroup.get('end').value})
          this.store.getActiveUsers({filterBy: DashboardRangeFilterEnum.WEEKLY, startDate: this.rangeFilterGroup.get('start').value, endDate: this.rangeFilterGroup.get('end').value})
          break;
        case (DashboardRangeFilterEnum.MONTHLY || DashboardRangeFilterEnum.DAILY):
          this.rangeFilterGroup.patchValue({
            end: DateTime.now().toISODate(),
            start: DateTime.now().toISODate()
          });
          this.store.getRegisteredUsers({filterBy: DashboardRangeFilterEnum.WEEKLY, startDate: this.rangeFilterGroup.get('start').value, endDate: this.rangeFilterGroup.get('end').value})
          this.store.getActiveUsers({filterBy: DashboardRangeFilterEnum.WEEKLY, startDate: this.rangeFilterGroup.get('start').value, endDate: this.rangeFilterGroup.get('end').value})
          break;
      }
      this.rangeFilterGroup.markAsUntouched();
    });
    this.store.getGenderData();
    this.rangeFilterGroup.controls.start.valueChanges.pipe(skip(1)).subscribe((value) => {
        this.store.getRegisteredUsers({
          filterBy: this.rangeFilterGroup.get('type').value,
          startDate: this.rangeFilterGroup.get('start').value,
          endDate: this.rangeFilterGroup.get('end').value
        })
        this.store.getActiveUsers({
          filterBy: this.rangeFilterGroup.get('type').value,
          startDate: this.rangeFilterGroup.get('start').value,
          endDate: this.rangeFilterGroup.get('end').value
        })
      }
    )
    this.rangeFilterGroup.controls.end.valueChanges.pipe(skip(1)).subscribe((value) => {
        this.store.getRegisteredUsers({
          filterBy: this.rangeFilterGroup.get('type').value,
          startDate: this.rangeFilterGroup.get('start').value,
          endDate: this.rangeFilterGroup.get('end').value
        })
        this.store.getActiveUsers({
          filterBy: this.rangeFilterGroup.get('type').value,
          startDate: this.rangeFilterGroup.get('start').value,
          endDate: this.rangeFilterGroup.get('end').value
        })
      }
    )
  };
  refreshList(): void {
    this.store.getTopWatched$();
    this.store.getPackEngagement$();
    this.store.getAssessmentEngagement$();
  }
  // get calenderView(): 'month' | 'year' | 'multi-year' {
  //   const type: DashboardRangeFilterEnum = this.rangeFilterGroup.controls.type.value;
  //   if (type === DashboardRangeFilterEnum.MONTHLY) {
  //     return 'month';
  //   }
  // }


}
