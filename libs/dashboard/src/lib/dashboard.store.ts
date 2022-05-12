import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  AssessmentEngagement, AssessmentLimitRequest,
  DashboardData, GoalsList, GoalsListFilters,
  PackEngagement, PackEngLimitRequest,
  TestWatched, TestWatchedLimitRequest, UserGraphData
} from './models/dashboard.interface';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DashboardService } from './services/dashboard.service';
import { UiStore } from '@hidden-innovation/shared/store';
import { ChartDatasets, ChartLabel, SingleOrMultiDataSet } from '@rinminase/ng-charts';
import { DashboardRangeFilterEnum, TagCategoryEnum } from '@hidden-innovation/shared/models';
import { Featured } from '@hidden-innovation/featured/data-access';
import { DateTime } from 'luxon';

export interface ActiveData {
  total: string;
  changePer: number;
}

export interface DashboardState extends Partial<DashboardData> {
  isLoading?: boolean;
  femaleUsers?: ChartDatasets;
  maleUsers?: ChartDatasets;
  nonBinaryUsers?: ChartDatasets;
  oosScore?: ChartDatasets;
  ageRatioData?: SingleOrMultiDataSet;
  completeTestEngagementLables?: Array<string>;
  completeTestEngagementData?: Array<number>;
  assessmentTestEngagementLables?: Array<string>;
  assessmentTestEngagementData?: Array<number>;
  registeredUsersLabel?: ChartLabel;
  registeredUsersData?: ChartDatasets;
  activeUsersLabel?: ChartLabel;
  activeUsersData?: ChartDatasets;
  filterBy?: DashboardRangeFilterEnum;
  isLineChartLoading?: boolean;
  test?: TestWatched[];
  packs: PackEngagement[];
  assessmentEng: AssessmentEngagement[];
  goalsList: GoalsList[];
  totalAssessmentEng: number;
  totalTests: number;
  totalPacks: number,
  isActing?: boolean;
  loaded?: boolean;
  registeredStatus?: Partial<UserGraphData>;
  totalScore:number;
  percentageIncrease:number;
}

const initialState: DashboardState = {
  isLoading: false,
  totalUser: 0,
  femaleUsers: [{ data: [], label: '' }],
  maleUsers: [{ data: [], label: '' }],
  nonBinaryUsers: [{ data: [], label: '' }],
  oosScore: [{ data: [], label: '' }],
  ageRatioData: [[]],
  completeTestEngagementLables: [],
  completeTestEngagementData: [],
  assessmentTestEngagementLables: [],
  assessmentTestEngagementData: [],
  filterBy: DashboardRangeFilterEnum.WEEKLY,
  registeredUsersLabel: [],
  registeredUsersData: [{ data: [], label: '' }],
  activeUsersLabel: [],
  activeUsersData: [{ data: [], label: '' }],
  isLineChartLoading: false,
  test: [],
  packs: [],
  assessmentEng: [],
  goalsList: [],
  totalPacks: 0,
  totalTests: 0,
  totalAssessmentEng: 0,
  isActing: false,
  loaded: false,
  totalScore:0,
  percentageIncrease:0,
  registeredStatus:
    {
      monthly: {
        total: '',
        changePer: 0,
        data: []
      },
      weekly: {
        total: '',
        changePer: 0,
        data: []
      },
      daily: {
        total: '',
        changePer: 0,
        data: []
      }
    }
};

@Injectable()
export class DashboardStore extends ComponentStore<DashboardState> {
  public _dummyRegisteresUserData: UserGraphData = {
    monthly: {
      total: '16k',
      changePer: -20,
      data: [
        {
          count: 3,
          date: DateTime.now().toISODate()
        },
        {
          count: 4,
          date: DateTime.now().toISODate()
        },
        {
          count: 6,
          date: DateTime.now().toISODate()
        }
      ]
    },
    weekly: {
      total: '5.2k',
      changePer: +50,
      data: [
        {
          count: 5,
          date: DateTime.now().toISODate()
        },
        {
          count: 20,
          date: DateTime.now().toISODate()
        }
      ]
    },
    daily: {
      total: '1.6k',
      changePer: +30,
      data: [
        {
          count: 10,
          date: DateTime.now().toISODate()
        }
      ]
    }
  };


  registeredStatus$: Observable<any> = this.select(state => state.registeredStatus ??
    {
      monthly: {
        total: '',
        changePer: 0,
        data: []
      },
      weekly: {
        total: '',
        changePer: 0,
        data: []
      },
      daily: {
        total: '',
        changePer: 0,
        data: []
      }
    }
  );


  testWatched$: Observable<TestWatched[]> = this.select(state => state.test || []);
  packEngagement$: Observable<PackEngagement[]> = this.select(state => state.packs || []);
  assessmentEng$: Observable<AssessmentEngagement[]> = this.select(state => state.assessmentEng || []);
  goalsList$: Observable<GoalsList[]> = this.select(state => state.goalsList || []);
  readonly testWatchedCount$: Observable<number> = this.select(state => state.totalTests || 0);
  readonly packEngCount$: Observable<number> = this.select(state => state.totalPacks || 0);
  readonly assessmentEngCount$: Observable<number> = this.select(state => state.totalAssessmentEng || 0);
  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly loaded$: Observable<boolean> = this.select(state => !!state.loaded);
  readonly isActing$: Observable<boolean> = this.select(state => !!state.isActing);


  readonly isChangeLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly isLineChartLoading$: Observable<boolean> = this.select(state => !!state.isLineChartLoading);
  readonly totalUsers$: Observable<number> = this.select(state => state.totalUser ?? 0);
  readonly percentageIncrease$: Observable<number> = this.select(state => state.percentageIncrease ?? 0);
  readonly totalOOSScore$: Observable<number> = this.select(state => state.totalScore ?? 0);
  readonly femaleUsers$: Observable<ChartDatasets> = this.select(state => state.femaleUsers ?? [{
    data: [],
    label: ''
  }]);
  readonly maleUsers$: Observable<ChartDatasets> = this.select(state => state.maleUsers ?? [{ data: [], label: '' }]);
  readonly nonBinaryUsers$: Observable<ChartDatasets> = this.select(state => state.nonBinaryUsers ?? [{
    data: [],
    label: ''
  }]);
  readonly oosScore$: Observable<ChartDatasets> = this.select(state => state.oosScore ?? [{
    data: [],
    label: ''
  }]);
  readonly ageRatioData$: Observable<SingleOrMultiDataSet> = this.select(state => state.ageRatioData ?? [[]]);
  readonly completeTestEngagementLables$: Observable<string[]> = this.select(state => state.completeTestEngagementLables ?? []);
  readonly completeTestEngagementData$: Observable<number[]> = this.select(state => state.completeTestEngagementData ?? []);
  readonly assessmentTestEngagementLables$: Observable<string[]> = this.select(state => state.assessmentTestEngagementLables ?? []);
  readonly assessmentTestEngagementData$: Observable<number[]> = this.select(state => state.assessmentTestEngagementData ?? []);
  readonly registeredUsersData$: Observable<ChartDatasets> = this.select((state => state.registeredUsersData ?? [{
    data: [],
    label: ''
  }]));
  readonly registeredUsersLabel$: Observable<ChartLabel> = this.select((state => state.registeredUsersLabel ?? []));
  readonly activeUserData$: Observable<ChartDatasets> = this.select((state => state.activeUsersData ?? [{
    data: [],
    label: ''
  }]));
  readonly activeUserLabel$: Observable<ChartLabel> = this.select((state => state.activeUsersLabel ?? []));


  readonly getStats = this.effect(params$ =>
    params$.pipe(
      tap(() => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap(() =>
        combineLatest([
          this.dashboardService.getStatistics().pipe(
            tap(
              (apiRes) => {
                const percent = parseInt(apiRes.percentageIncrease.toFixed(2));
                this.patchState({
                  isLoading: false,
                  totalUser: apiRes.totalUser,
                  percentageIncrease: percent,
                });
              },
              err => {
                this.patchState({
                  isLoading: false
                });
              }
            ),
            catchError(() => EMPTY))

        ])
      )
    )
  );

  readonly getGenderData = this.effect(params$ =>
    params$.pipe(
      tap(() => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap(() =>
        this.dashboardService.getGenderStatics().pipe(
          tap(
            (apiRes) => {

              const ageRatioData = this.convertToPercentage(apiRes.femaleUsers, apiRes.maleUsers, apiRes.nonBinaryUsers, apiRes.totalUsers);
              const f = this.convertToChartData(apiRes.femaleUsers);
              this.patchState({
                isLoading: false,
                femaleUsers: f,
                maleUsers: this.convertToChartData(apiRes.maleUsers),
                nonBinaryUsers: this.convertToChartData(apiRes.nonBinaryUsers),
                ageRatioData
              });
            },
            err => {
              this.patchState({
                isLoading: false
              });
            }
          ),
          catchError(() => EMPTY))
      )
    )
  );
  readonly getCompleteTestEngagement = this.effect(params$ =>
    params$.pipe(
      tap(() => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap(() =>
        this.dashboardService.getAllTestEngagement().pipe(
          tap(
            (apiRes) => {
              const dataSet = this.completeTestEngagementDataSet(apiRes.userTestEngagement);
              this.patchState({
                isLoading: false,
                completeTestEngagementData: dataSet.data,
                completeTestEngagementLables: dataSet.label
              });
            },
            err => {
              this.patchState({
                isLoading: false
              });
            }
          ),
          catchError(() => EMPTY))
      )
    )
  );
  readonly getAssessmentTestEngagement = this.effect(params$ =>
    params$.pipe(
      tap(() => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap(() =>
        this.dashboardService.getAssessmentTestEngagement().pipe(
          tap(
            (apiRes) => {
              const dataSet = this.assessmentTestEngagementDataSet(apiRes.totalAttemptedCategory);
              this.patchState({
                isLoading: false,
                assessmentTestEngagementData: dataSet.data,
                assessmentTestEngagementLables: dataSet.label
              });
            },
            err => {
              this.patchState({
                isLoading: false
              });
            }
          ),
          catchError(() => EMPTY))
      )
    )
  );


  readonly getRegisteredUsers = this.effect<{ filterBy: DashboardRangeFilterEnum; startDate: string; endDate: string }>(params$ =>
    params$.pipe(
      tap((req) => {
        this.patchState({
          isLineChartLoading: true,
          filterBy: req.filterBy
        });
      }),
      switchMap((req) =>
        this.dashboardService.getRegisteredUsers(req).pipe(
          tap(
            (apiRes) => {
              // this.patchState({
              //   registeredStatus:{
              //     monthly:{
              //       total:this._dummyRegisteresUserData.monthly.total,
              //       changePer: this._dummyRegisteresUserData.monthly.changePer,
              //       data:[]
              //     },
              //     weekly:{
              //       total:this._dummyRegisteresUserData.weekly.total,
              //       changePer: this._dummyRegisteresUserData.weekly.changePer,
              //       data:[]
              //     },
              //     daily:{
              //       total:this._dummyRegisteresUserData.daily.total,
              //       changePer: this._dummyRegisteresUserData.daily.changePer,
              //       data:[]
              //     },
              //   }
              // })
              //
              // switch (req.filterBy)
              // {
              //   case DashboardRangeFilterEnum.MONTHLY: {
              //     const localDataSet = this.registeredDataSets(DashboardRangeFilterEnum.MONTHLY);
              //     this.patchState({
              //       isLineChartLoading: false,
              //       registeredUsersData: localDataSet.datasets,
              //       registeredUsersLabel: localDataSet.label
              //     })
              //   }
              //   break;
              //   case DashboardRangeFilterEnum.WEEKLY: {
              //     const localDataSet = this.registeredDataSets(DashboardRangeFilterEnum.WEEKLY);
              //     this.patchState({
              //       isLineChartLoading: false,
              //       registeredUsersData: localDataSet.datasets,
              //       registeredUsersLabel: localDataSet.label
              //     })
              //   }
              //   break;
              //   case DashboardRangeFilterEnum.DAILY: {
              //     const localDataSet = this.registeredDataSets(DashboardRangeFilterEnum.DAILY);
              //     this.patchState({
              //       isLineChartLoading: false,
              //       registeredUsersData: localDataSet.datasets,
              //       registeredUsersLabel: localDataSet.label
              //     })
              //   }
              //   break;
              // }

              const dataSet = this.convertDataFormat(apiRes.users, req);

              this.patchState({
                isLineChartLoading: false,
                registeredUsersData: dataSet.dataSet,
                registeredUsersLabel: dataSet.labels
              });
            },
            err => {
              this.patchState({
                isLineChartLoading: false
              });
            }
          ),
          catchError(() => EMPTY))
      )
    )
  );
  readonly getActiveUsers = this.effect<{ filterBy: DashboardRangeFilterEnum; startDate: string; endDate: string }>(params$ =>
    params$.pipe(
      tap((req) => {
        this.patchState({
          isLineChartLoading: true,
          filterBy: req.filterBy
        });
      }),
      switchMap((req) =>
        this.dashboardService.getActiveUsers(req).pipe(
          tap(
            (apiRes) => {
              const dataSet = this.convertDataFormat(apiRes.users, req);
              this.patchState({
                isLineChartLoading: false,
                activeUsersData: dataSet.dataSet,
                activeUsersLabel: dataSet.labels
              });
            },
            err => {
              this.patchState({
                isLineChartLoading: false
              });
            }
          ),
          catchError(() => EMPTY))
      )
    )
  );

  getTopWatched$ = this.effect<TestWatchedLimitRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap((reqObj) =>
        this.dashboardService.getTopWatched(reqObj).pipe(
          tapResponse(
            ({ test, totalTests }) => {
              this.patchState({
                isLoading: false,
                test,
                totalTests
              });
            },
            _ => {
              this.patchState({
                isLoading: false
              });
            }
          ),
          catchError(() => EMPTY))
      )
    )
  );
  getPackEngagement$ = this.effect<PackEngLimitRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap((reqObj) =>
        this.dashboardService.getPackEng(reqObj).pipe(
          tapResponse(
            ({ packs, totalPacks }) => {
              this.patchState({
                isLoading: false,
                packs,
                totalPacks
              });

            },
            _ => {
              this.patchState({
                isLoading: false
              });
            }
          ),
          catchError(() => EMPTY))
      )
    )
  );
  getGoals$ = this.effect<GoalsListFilters>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap((reqObj) =>
        this.dashboardService.getGoalsList(reqObj).pipe(
          tapResponse(
            (goalsList) => {
              this.patchState({
                isLoading: false,
                goalsList
              });
            },
            _ => {
              this.patchState({
                isLoading: false
              });
            }
          ),
          catchError(() => EMPTY))
      )
    )
  );

  getAssessmentEngagement$ = this.effect<AssessmentLimitRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap((reqObj) =>
        this.dashboardService.getAssessmentEng(reqObj).pipe(
          tapResponse(
            (assessmentEng) => {
              this.patchState({
                isLoading: false,
                assessmentEng
              });
            },
            _ => {
              this.patchState({
                isLoading: false
              });
            }
          ),
          catchError(() => EMPTY))
      )
    )
  );
  readonly getOOS = this.effect(params$ =>
    params$.pipe(
      tap(() => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap(() =>
        combineLatest([
          this.dashboardService.getOOS().pipe(
            tap(
              (apiRes) => {
                const tableData = apiRes[0].table;
                const totalScore = apiRes[1].OOS.toFixed(2);
                const tableSet = this.convertOOSChart(tableData);
                this.patchState({
                  isLoading: false,
                  totalScore: totalScore,
                  oosScore: tableSet
                });
              },
              err => {
                this.patchState({
                  isLoading: false
                });
              }
            ),
            catchError(() => EMPTY))

        ])
      )
    )
  );


  public registeredDataSets(filter: DashboardRangeFilterEnum): { datasets: ChartDatasets, label: ChartLabel } {
    let dataLabels: ChartLabel = [];
    let dataSet: number[] = [];
    // if (filter.monthly)
    // {
    //   dataSet = filter.monthly.data.map(res => res.count);
    //   dataLabels = filter.monthly.data.map(res => res.date);
    // }
    // else if(filter.weekly)
    // {
    //   dataSet = filter.weekly.data.map(res => res.count);
    //   dataLabels = filter.weekly.data.map(res => res.date);
    // }
    // else if(filter.daily)
    // {
    //   dataSet = filter.daily.data.map(res => res.count);
    //   dataLabels = filter.daily.data.map(res => res.date);
    // }
    switch (filter) {
      case DashboardRangeFilterEnum.WEEKLY:
        dataSet = this._dummyRegisteresUserData.weekly.data.map(res => res.count);
        dataLabels = this._dummyRegisteresUserData.weekly.data.map(res => res.date);
        break;
      case DashboardRangeFilterEnum.MONTHLY:
        dataSet = this._dummyRegisteresUserData.monthly.data.map(res => res.count);
        dataLabels = this._dummyRegisteresUserData.monthly.data.map(res => res.date);
        break;
      case DashboardRangeFilterEnum.DAILY:
        dataSet = this._dummyRegisteresUserData.daily.data.map(res => res.count);
        dataLabels = this._dummyRegisteresUserData.daily.data.map(res => res.date);
        break;
    }
    return { datasets: [{ data: dataSet }], label: dataLabels };
  }


  constructor(
    private dashboardService: DashboardService,
    private uiStore: UiStore
  ) {
    super(initialState);
  }


  public convertDataFormat(users: { id: number; name: string; created_at?: string; lastActive?: string }[], reqObj: { startDate: string; endDate: string, filterBy: DashboardRangeFilterEnum }, activeUser?: false): { dataSet: ChartDatasets; labels: ChartLabel } {
    const filterBy = reqObj.filterBy;
    let dataLabels: ChartLabel = [];
    let dataSet: number[] = [];
    const label = '';
    if (!users.length) {
      return { dataSet: [{ data: dataSet, label: label }], labels: dataLabels };
    }
    // if (filterBy === 'DashboardRangeFilterEnum.DAILY') {
    //   dataLabels = [
    //     'Jan',
    //     'Feb',
    //     'Mar',
    //     'Apr',
    //     'May',
    //     'Jun',
    //     'Jul',
    //     'Aug',
    //     'Sep',
    //     'Oct',
    //     'Nov',
    //     'Dec'
    //   ];
    //   dataSet = Array.from(Array(12).fill(0));
    //   for (const user of users) {
    //     const month = new Date(user.created_at).getMonth();
    //     dataSet[month]++;
    //   }
    // } else
    if (filterBy === DashboardRangeFilterEnum.MONTHLY) {
      const totalDaysInMonth = users[0]?.created_at ? daysInMonth(users[0]?.created_at) : daysInMonth(users[0].lastActive);
      dataLabels = Array.from(Array(totalDaysInMonth).fill(0)).map((_, idx) => {
        return `${idx + 1}`;
      });
      dataSet = Array.from(Array(totalDaysInMonth).fill(0));
      for (const user of users) {
        const createdAt: string = user.created_at ?? '';
        const lastActive: string = user.lastActive ?? '';
        const date = createdAt ? new Date(createdAt).getDate() : new Date(lastActive).getDate();
        dataSet[date]++;
      }
    } else if (filterBy === DashboardRangeFilterEnum.WEEKLY) {
      let startDay = new Date(reqObj.startDate).getDay();
      dataLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      dataSet = Array.from(Array(7).fill(0));
      for (const user of users) {
        const createdAt: string = user.created_at ?? '';
        const lastActive: string = user.lastActive ?? '';
        const date = createdAt ? new Date(createdAt).getDay() : new Date(lastActive).getDay();
        dataSet[date]++;
      }
      while (startDay--) {
        dataLabels.push(dataLabels.shift() as string);
        dataSet.push(dataSet.shift() as number);
      }
    } else if (filterBy === DashboardRangeFilterEnum.DAILY) {
      dataLabels = getDateArray(new Date(reqObj.startDate), new Date(reqObj.endDate)) as ChartLabel;
      const obj: { [key in string]: number } = {};
      for (const key of dataLabels) {
        obj[key] = 0;
      }
      dataSet = Array.from(Array(dataLabels.length).fill(0));
      for (const user of users) {
        let key = '01-12';
        if (user.created_at) {
          key = new Date(user.created_at).toLocaleDateString().split('/')[0] + '-' + new Date(user.created_at).toLocaleDateString().split('/')[1];
        } else if (user.lastActive) {
          key = new Date(user.lastActive).toLocaleDateString().split('/')[0] + '-' + new Date(user.lastActive).toLocaleDateString().split('/')[1];
        }
        obj[key]++;
      }
      dataSet = Object.values(obj);

    }
    return { dataSet: [{ data: dataSet, label: label }], labels: dataLabels };
  }

  public convertOOSChart(table: { categoryName: string, cps: any }[]): ChartDatasets {
    const label = 'OOS';
    const data = [0, 0, 0, 0, 0];
    for (const item of table) {
      if (item.categoryName === 'STRENGTH') {
        data[0] = item.cps.toFixed(2);
      } else if (item.categoryName === 'CARDIO') {
        data[1] = item.cps.toFixed(2);
      } else if (item.categoryName === 'FUNCTION') {
        data[2] = item.cps.toFixed(2);
      } else if (item.categoryName === 'LIFESTYLE') {
        data[3] = item.cps.toFixed(2);
      } else if (item.categoryName === 'MOBILITY') {
        data[4] = item.cps.toFixed(2);
      }
    }
    return [{ data, label }];
  }

  public convertToPercentage(female: [], male: [], other: [], totalUsers: number | undefined): SingleOrMultiDataSet {
    if (!totalUsers) {
      return [[0, 0, 0]];
    }
    const noOfMaleUsers = parseFloat(((male.length / totalUsers) * 100).toFixed(2));
    const noOfFemaleUsers = parseFloat(((female.length / totalUsers) * 100).toFixed(2));
    const noOfOtherUsers = parseFloat(((other.length / totalUsers) * 100).toFixed(2));
    return [[noOfMaleUsers, noOfFemaleUsers, noOfOtherUsers]];
  }

  public completeTestEngagementDataSet(tests: { userPercentage: number; name: string }[]): { data: number[], label: string[] } {
    const label = [];
    const data = [];
    const sortedTestByScore = tests.sort((a, b) => b.userPercentage - a.userPercentage).slice(0, 6);
    for (const test of sortedTestByScore) {
      label.push(test.name);
      data.push(test.userPercentage);
    }
    return { data, label };
  }

  public assessmentTestEngagementDataSet(category: { [key in TagCategoryEnum]: number }): { data: number[], label: string[] } {
    const label = Object.keys(category);
    const data = Object.values(category);
    return { data, label };
  }

  public convertToChartData(users: { id: number; age: number; gender: string }[]): ChartDatasets {
    if (!users) {
      return [{ data: [], label: '' }];
    }
    const label = 'female';
    const data = [0, 0, 0, 0];
    for (const user of users) {
      if (user.age >= 18 && user.age <= 24) {
        data[0] += 1;
      } else if (user.age >= 25 && user.age <= 34) {
        data[1] += 1;
      } else if (user.age >= 35 && user.age <= 44) {
        data[2] += 1;
      } else if (user.age >= 45) {
        data[3] += 1;
      }
    }
    return [{ data, label }];
  }
}


function daysInMonth(date: string | undefined) {
  if (!date) {
    return 30;
  }
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth();
  return new Date(year, month, 0).getDate();
}

function getDateArray(start: Date, end: Date): ChartLabel {
  const arr: ChartLabel = [];
  const dt = new Date(start);
  while (dt <= end) {
    arr.push(new Date(dt).toLocaleDateString().split('/')[0] + '-' + new Date(dt).toLocaleDateString().split('/')[1]);
    dt.setDate(dt.getDate() + 1);
  }
  return arr as ChartLabel;
}
