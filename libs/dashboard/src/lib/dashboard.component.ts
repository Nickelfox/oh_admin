import { ChangeDetectorRef, Component } from '@angular/core';
import { ChartColor, ChartDatasets, ChartLabel, ChartOptions, SingleOrMultiDataSet } from '@rinminase/ng-charts';
import { DashboardStore } from './dashboard.store';
import {DashboardRangeFilterEnum, TagCategoryEnum, UserDetails} from '@hidden-innovation/shared/models';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { AssessmentEngagement, DashboardRequest, PackEngagement, TestWatched } from './models/dashboard.interface';
import { Validators } from '@angular/forms';
import { DateTime } from 'luxon';
import { UntilDestroy } from '@ngneat/until-destroy';
import { map, skip } from 'rxjs/operators';
import {forEach} from "lodash-es";
import {MatTableDataSource} from "@angular/material/table";
import { PageEvent } from '@angular/material/paginator';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';


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



  displayedColumnsAssessmentTest: string[] = ['position', 'name', 'id', 'score', 'completion'];
  assessmentTestTable: MatTableDataSource<AssessmentEngagement> = new MatTableDataSource<AssessmentEngagement>();

  displayedColumnsPackEng: string[] = ['position', 'name', 'id', 'totalPlays', 'contentClicks', 'resourcesClicks'];
  packEngTable: MatTableDataSource<PackEngagement> = new MatTableDataSource<PackEngagement>();

  displayedColumnsTopWatched: string[] = ['position', 'name', 'id', 'videoPlays', 'resultLog'];
  topWatchedTable: MatTableDataSource<TestWatched> = new MatTableDataSource<TestWatched>();
  noData?: Observable<boolean>;




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


  //Top Watched Paginator options
  topTestPageIndex = this.constantDataService.PaginatorData.pageIndex;
  topWatchedPageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  topWatchedPageSize = this.constantDataService.PaginatorData.pageSize;
  topWatchedPageEvent: PageEvent | undefined;

  //Pack Engagement Paginator options
  packEngPageIndex = this.constantDataService.PaginatorData.pageIndex;
  packEngPageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  packEngPageSize = this.constantDataService.PaginatorData.pageSize;
  packEngPageEvent: PageEvent | undefined;

  //Assessment Engagement Paginator options
  assessmentEngPageIndex = this.constantDataService.PaginatorData.pageIndex;
  assessmentEngPageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  assessmentEngPageSize = this.constantDataService.PaginatorData.pageSize;
  assessmentEngPageEvent: PageEvent | undefined;


  constructor(
    public store: DashboardStore,
    public constantDataService: ConstantDataService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.refreshListTopTest();
    this.refreshListPackEng();
    this.refreshListAssessmentEng();
    this.store.testWatched$.subscribe(res => {
      this.topWatchedTable = new MatTableDataSource<TestWatched>(res)
      this.noData = this.topWatchedTable.connect().pipe(map(data => data.length === 0));
      if (!res?.length && (this.topTestPageIndex > this.constantDataService.PaginatorData.pageIndex)) {
        this.resetTopTestPagination();
      }
      this.cdr.markForCheck();
    });
    this.store.packEngagement$.subscribe(res => {
      this.packEngTable = new MatTableDataSource<PackEngagement>(res)
      this.noData = this.packEngTable.connect().pipe(map(data => data.length === 0));
      if (!res?.length && (this.packEngPageIndex > this.constantDataService.PaginatorData.pageIndex)) {
        this.resetPackEngPagination();
      }
      this.cdr.markForCheck();
    });
    this.store.assessmentEng$.subscribe(res => {
      this.assessmentTestTable = new MatTableDataSource<AssessmentEngagement>(res);
      this.noData = this.assessmentTestTable.connect().pipe(map(data => data.length === 0));
      if (!res?.length && (this.assessmentEngPageIndex > this.constantDataService.PaginatorData.pageIndex)) {
        this.resetAssessmentEngPagination();
      }
      this.cdr.markForCheck();
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

// Top Watched pagination
  refreshListTopTest(): void {
    this.store.getTopWatched$({
      page: this.topTestPageIndex,
      limit: this.topWatchedPageSize
    });
  }

  get paginatorIndexTopTest() {
    return this.topTestPageIndex - 1;
  }

  onPaginateChangeTopTest($event: PageEvent): void {
    this.topTestPageIndex = $event.pageIndex + 1;
    this.topWatchedPageSize = $event.pageSize;
    this.refreshListTopTest();
  }
  resetTopTestPagination(): void {
    this.topTestPageIndex = this.constantDataService.PaginatorData.pageIndex;
    this.topWatchedPageSize = this.constantDataService.PaginatorData.pageSize;
    this.refreshListTopTest();
  }
  // Pack Engagement Pagination
  refreshListPackEng(): void {

    this.store.getPackEngagement$({
      page: this.packEngPageIndex,
      limit: this.packEngPageSize
    });
  }

  get paginatorIndexPackEng() {
    return this.packEngPageIndex - 1;
  }

  onPaginateChangePackEng($event: PageEvent): void {
    this.packEngPageIndex = $event.pageIndex + 1;
    this.packEngPageSize = $event.pageSize;
    this.refreshListPackEng();
  }
  resetPackEngPagination(): void {
    this.packEngPageIndex = this.constantDataService.PaginatorData.pageIndex;
    this.packEngPageSize = this.constantDataService.PaginatorData.pageSize;
    this.refreshListPackEng();
  }

  // Assessment Engagement Pagination
  refreshListAssessmentEng(): void {
    this.store.getAssessmentEngagement$({
      page: this.assessmentEngPageIndex,
      limit: this.assessmentEngPageSize
    });
  }

  get paginatorIndexAssessmentEng() {
    return this.assessmentEngPageIndex - 1;
  }

  onPaginateChangeAssessmentEng($event: PageEvent): void {
    this.assessmentEngPageIndex = $event.pageIndex + 1;
    this.assessmentEngPageSize = $event.pageSize;
    this.refreshListPackEng();
  }
  resetAssessmentEngPagination(): void {
    this.assessmentEngPageIndex = this.constantDataService.PaginatorData.pageIndex;
    this.assessmentEngPageSize = this.constantDataService.PaginatorData.pageSize;
    this.refreshListAssessmentEng();
  }

  // get calenderView(): 'month' | 'year' | 'multi-year' {
  //   const type: DashboardRangeFilterEnum = this.rangeFilterGroup.controls.type.value;
  //   if (type === DashboardRangeFilterEnum.MONTHLY) {
  //     return 'month';
  //   }
  // }


}
