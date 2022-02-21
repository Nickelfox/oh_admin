import { ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import { ChartColor, ChartLabel, ChartOptions } from '@rinminase/ng-charts';
import { DashboardStore } from './dashboard.store';
import { DashboardRangeFilterEnum, SortingEnum, TagCategoryEnum } from '@hidden-innovation/shared/models';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
  AssessmentEngagement,
  AssessmentEngagementFilters,
  DashboardRequest,
  PackEngagement,
  PackEngagementFilters,
  TestWatched,
  TestWatchedFilters
} from './models/dashboard.interface';
import { Validators } from '@angular/forms';
import { DateTime } from 'luxon';
import { UntilDestroy } from '@ngneat/until-destroy';
import { distinctUntilChanged, map, skip, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isEqual } from 'lodash-es';


export interface AssessmentTestEng {
  position: number;
  name: string;
  id: number;
  score: number;
  completion: string;
}

export interface PackEng {
  position: number;
  name: string;
  id: number;
  totalPlays: number;
  contentClicks: number;
  resourcesClicks: number
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


export class DashboardComponent implements OnInit {

  displayedColumnsAssessmentTest: string[] = ['position', 'name', 'id', 'average_score', 'completion'];
  assessmentTestTable: MatTableDataSource<AssessmentEngagement> = new MatTableDataSource<AssessmentEngagement>();

  displayedColumnsPackEng: string[] = ['position', 'name', 'id', 'video_plays', 'content_clicks', 'resource_clicks'];
  packEngTable: MatTableDataSource<PackEngagement> = new MatTableDataSource<PackEngagement>();

  displayedColumnsTopWatched: string[] = ['position', 'name', 'id', 'video_plays', 'result_logs'];
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

  colors: { [key: string]: string } = {
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
    '#54DBDF'];

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


  chartOptionsTest: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem, data): any => {
          // @ts-ignore
          const value = data.datasets[0].data[tooltipItem.index];
          // @ts-ignore
          return ` ${data.labels[tooltipItem.index]}: ${value}%`;
        }
      }
    }

  };


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


  sortingEnum = SortingEnum;
  emitSorting: EventEmitter<string> = new EventEmitter<string>();
  //Top Watched Paginator options
  topTestPageIndex = this.constantDataService.PaginatorData.pageIndex;
  topWatchedPageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  topWatchedPageSize = this.constantDataService.PaginatorData.pageSize;
  topWatchedPageEvent: PageEvent | undefined;
  filtersTestWatched: FormGroup<TestWatchedFilters> = new FormGroup<TestWatchedFilters>({
    videoplaySort: new FormControl(SortingEnum.DESC),
    resultlogSort: new FormControl({ value: undefined, disabled: true })
  });
  //Pack Engagement Paginator options
  packEngPageIndex = this.constantDataService.PaginatorData.pageIndex;
  packEngPageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  packEngPageSize = this.constantDataService.PaginatorData.pageSize;
  packEngPageEvent: PageEvent | undefined;
  filtersPackEng: FormGroup<PackEngagementFilters> = new FormGroup<PackEngagementFilters>({
    contentclicksSort: new FormControl(SortingEnum.DESC),
    resourceclicksSort: new FormControl({ value: undefined, disabled: true })
  });
  //Assessment Engagement Paginator options
  assessmentEngPageIndex = this.constantDataService.PaginatorData.pageIndex;
  assessmentEngPageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  assessmentEngPageSize = this.constantDataService.PaginatorData.pageSize;
  assessmentEngPageEvent: PageEvent | undefined;
  filtersAssessmentEng: FormGroup<AssessmentEngagementFilters> = new FormGroup<AssessmentEngagementFilters>({
    averagescoreSort: new FormControl(SortingEnum.DESC),
    completionSort: new FormControl({ value: undefined, disabled: true })
  });


  constructor(
    public store: DashboardStore,
    public constantDataService: ConstantDataService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.refreshListTopTest();
    this.refreshListPackEng();
    this.refreshListAssessmentEng();
    this.store.testWatched$.subscribe(res => {
      this.topWatchedTable = new MatTableDataSource<TestWatched>(res);
      this.noData = this.topWatchedTable.connect().pipe(map(data => data.length === 0));
      if (!res?.length && (this.topTestPageIndex > this.constantDataService.PaginatorData.pageIndex)) {
        this.resetTopTestPagination();
      }
      this.cdr.markForCheck();
    });
    this.store.packEngagement$.subscribe(res => {
      this.packEngTable = new MatTableDataSource<PackEngagement>(res);
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
    this.store.getRegisteredUsers({
      filterBy: DashboardRangeFilterEnum.WEEKLY, endDate: DateTime.now().toISODate(), startDate: DateTime.now().minus({
        days: 7
      }).toISODate()
    });
    this.store.getActiveUsers({
      filterBy: DashboardRangeFilterEnum.WEEKLY, endDate: DateTime.now().toISODate(), startDate: DateTime.now().minus({
        days: 7
      }).toISODate()
    });
    this.rangeFilterGroup.controls.type.valueChanges.subscribe(res => {
      switch (res) {
        case DashboardRangeFilterEnum.WEEKLY:
          this.rangeFilterGroup.patchValue({
            end: DateTime.now().toISODate(),
            start: DateTime.now().minus({
              days: 7
            }).toISODate()
          });
          this.store.getRegisteredUsers({
            filterBy: DashboardRangeFilterEnum.WEEKLY,
            startDate: this.rangeFilterGroup.get('start').value,
            endDate: this.rangeFilterGroup.get('end').value
          });
          this.store.getActiveUsers({
            filterBy: DashboardRangeFilterEnum.WEEKLY,
            startDate: this.rangeFilterGroup.get('start').value,
            endDate: this.rangeFilterGroup.get('end').value
          });
          break;
        case (DashboardRangeFilterEnum.MONTHLY || DashboardRangeFilterEnum.DAILY):
          this.rangeFilterGroup.patchValue({
            end: DateTime.now().toISODate(),
            start: DateTime.now().toISODate()
          });
          this.store.getRegisteredUsers({
            filterBy: DashboardRangeFilterEnum.WEEKLY,
            startDate: this.rangeFilterGroup.get('start').value,
            endDate: this.rangeFilterGroup.get('end').value
          });
          this.store.getActiveUsers({
            filterBy: DashboardRangeFilterEnum.WEEKLY,
            startDate: this.rangeFilterGroup.get('start').value,
            endDate: this.rangeFilterGroup.get('end').value
          });
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
        });
        this.store.getActiveUsers({
          filterBy: this.rangeFilterGroup.get('type').value,
          startDate: this.rangeFilterGroup.get('start').value,
          endDate: this.rangeFilterGroup.get('end').value
        });
      }
    );
    this.rangeFilterGroup.controls.end.valueChanges.pipe(skip(1)).subscribe((value) => {
        this.store.getRegisteredUsers({
          filterBy: this.rangeFilterGroup.get('type').value,
          startDate: this.rangeFilterGroup.get('start').value,
          endDate: this.rangeFilterGroup.get('end').value
        });
        this.store.getActiveUsers({
          filterBy: this.rangeFilterGroup.get('type').value,
          startDate: this.rangeFilterGroup.get('start').value,
          endDate: this.rangeFilterGroup.get('end').value
        });
      }
    );

  };


// Top Watched pagination
  refreshListTopTest(): void {
    const { videoplaySort, resultlogSort } = this.filtersTestWatched.value;
    this.store.getTopWatched$({
      page: this.topTestPageIndex,
      limit: this.topWatchedPageSize,
      resultlogSort,
      videoplaySort
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

  updateTopWatched(fieldName: 'videoplaySort' | 'resultlogSort'): void {
    const { videoplaySort, resultlogSort } = this.filtersTestWatched.controls;
    const updateSortingCtrl = (ctrl: FormControl) => {
      if (ctrl.disabled) {
        ctrl.setValue(this.sortingEnum.DESC);
        ctrl.enable();
      } else {
        ctrl.value === SortingEnum.DESC ? ctrl.setValue(this.sortingEnum.ASC) : ctrl.setValue(this.sortingEnum.DESC);
      }
      this.cdr.markForCheck();
    };


    switch (fieldName) {
      case 'videoplaySort':
        resultlogSort.disable();
        updateSortingCtrl(videoplaySort);
        break;
      case 'resultlogSort':
        videoplaySort.disable();
        updateSortingCtrl(resultlogSort);
        break;
    }
  }


  // Pack Engagement Pagination
  refreshListPackEng(): void {
    const { contentclicksSort, resourceclicksSort } = this.filtersPackEng.value;
    this.store.getPackEngagement$({
      page: this.packEngPageIndex,
      limit: this.packEngPageSize,
      contentclicksSort,
      resourceclicksSort
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

  updatePackSorting(fieldName: 'resourceclicksSort' | 'contentclicksSort'): void {
    const { resourceclicksSort, contentclicksSort } = this.filtersPackEng.controls;
    const updateSortingCtrl = (ctrl: FormControl) => {
      if (ctrl.disabled) {
        ctrl.setValue(this.sortingEnum.DESC);
        ctrl.enable();
      } else {
        ctrl.value === SortingEnum.DESC ? ctrl.setValue(this.sortingEnum.ASC) : ctrl.setValue(this.sortingEnum.DESC);
      }
      this.cdr.markForCheck();
    };

    switch (fieldName) {
      case 'resourceclicksSort':
        contentclicksSort.disable();
        updateSortingCtrl(resourceclicksSort);
        break;
      case 'contentclicksSort':
        resourceclicksSort.disable();
        updateSortingCtrl(contentclicksSort);
        break;
    }
  }

  // Assessment Engagement Pagination
  refreshListAssessmentEng(): void {
    const { averagescoreSort, completionSort } = this.filtersAssessmentEng.value;
    this.store.getAssessmentEngagement$({
      page: this.assessmentEngPageIndex,
      limit: this.assessmentEngPageSize,
      completionSort,
      averagescoreSort
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


  updateAssessmentSorting(fieldName: 'completionSort' | 'averagescoreSort'): void {
    const { averagescoreSort, completionSort } = this.filtersAssessmentEng.controls;

    const updateSortingCtrl = (ctrl: FormControl) => {
      if (ctrl.disabled) {
        ctrl.setValue(this.sortingEnum.DESC);
        ctrl.enable();
      } else {
        ctrl.value === SortingEnum.DESC ? ctrl.setValue(this.sortingEnum.ASC) : ctrl.setValue(this.sortingEnum.DESC);
      }
      this.cdr.markForCheck();
    };

    switch (fieldName) {
      case 'averagescoreSort':
        completionSort.disable();
        updateSortingCtrl(averagescoreSort);
        break;
      case 'completionSort':
        averagescoreSort.disable();
        updateSortingCtrl(completionSort);
        break;

    }
  }

  // get calenderView(): 'month' | 'year' | 'multi-year' {
  //   const type: DashboardRangeFilterEnum = this.rangeFilterGroup.controls.type.value;
  //   if (type === DashboardRangeFilterEnum.MONTHLY) {
  //     return 'month';
  //   }
  // }

  ngOnInit(): void {
    this.filtersPackEng.valueChanges.pipe(
      distinctUntilChanged((x, y) => isEqual(x, y)),
      tap(res => {
        this.refreshListPackEng();
      })
    ).subscribe();
    this.filtersTestWatched.valueChanges.pipe(
      distinctUntilChanged((x, y) => isEqual(x, y)),
      tap(res => {
        this.refreshListTopTest();
      })
    ).subscribe();
    this.filtersAssessmentEng.valueChanges.pipe(
      distinctUntilChanged((x, y) => isEqual(x, y)),
      tap(res => {
        this.refreshListAssessmentEng();
      })
    ).subscribe();
  }


}
