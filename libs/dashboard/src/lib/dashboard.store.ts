import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { DashboardData } from './models/dashboard.interface';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DashboardService } from './services/dashboard.service';
import { UiStore } from '@hidden-innovation/shared/store';
import { ChartDatasets, ChartLabel, SingleOrMultiDataSet } from '@rinminase/ng-charts';
import { DashboardRangeFilterEnum, TagCategoryEnum } from '@hidden-innovation/shared/models';

export interface DashboardState extends Partial<DashboardData> {
  isLoading?: boolean;
  femaleUsers?: ChartDatasets;
  maleUsers?: ChartDatasets;
  nonBinaryUsers?: ChartDatasets;
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
}

const initialState: DashboardState = {
  isLoading: false,
  totalUser: 0,
  femaleUsers: [{ data: [], label: '' }],
  maleUsers: [{ data: [], label: '' }],
  nonBinaryUsers: [{ data: [], label: '' }],
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
  isLineChartLoading: false
};

@Injectable()
export class DashboardStore extends ComponentStore<DashboardState> {

  readonly isChangeLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly isLineChartLoading$: Observable<boolean> = this.select(state => !!state.isLineChartLoading);
  readonly totalUsers$: Observable<number> = this.select(state => state.totalUser ?? 0);
  readonly femaleUsers$: Observable<ChartDatasets> = this.select(state => state.femaleUsers ?? [{
    data: [],
    label: ''
  }]);
  readonly maleUsers$: Observable<ChartDatasets> = this.select(state => state.maleUsers ?? [{ data: [], label: '' }]);
  readonly nonBinaryUsers$: Observable<ChartDatasets> = this.select(state => state.nonBinaryUsers ?? [{
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
        this.uiStore.toggleGlobalLoading(true);
      }),
      switchMap(() =>
        combineLatest([
          this.dashboardService.getStatistics().pipe(
            tap(
              (apiRes) => {
                this.patchState({
                  isLoading: false,
                  totalUser: apiRes.totalUser
                });
                this.uiStore.toggleGlobalLoading(false);
              },
              err => {
                this.patchState({
                  isLoading: false
                });
                this.uiStore.toggleGlobalLoading(false);

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
        this.uiStore.toggleGlobalLoading(true);
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
              this.uiStore.toggleGlobalLoading(false);
            },
            err => {
              this.patchState({
                isLoading: false
              });
              this.uiStore.toggleGlobalLoading(false);

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
        this.uiStore.toggleGlobalLoading(true);
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
              this.uiStore.toggleGlobalLoading(false);
            },
            err => {
              this.patchState({
                isLoading: false
              });
              this.uiStore.toggleGlobalLoading(false);

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
        this.uiStore.toggleGlobalLoading(true);
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
              this.uiStore.toggleGlobalLoading(false);
            },
            err => {
              this.patchState({
                isLoading: false
              });
              this.uiStore.toggleGlobalLoading(false);

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
        this.uiStore.toggleGlobalLoading(true);
      }),
      switchMap((req) =>
        this.dashboardService.getRegisteredUsers(req).pipe(
          tap(
            (apiRes) => {
              const dataSet = this.convertDataFormat(apiRes.users, req);
              this.patchState({
                isLineChartLoading: false,
                registeredUsersData: dataSet.dataSet,
                registeredUsersLabel: dataSet.labels
              });
              this.uiStore.toggleGlobalLoading(false);
            },
            err => {
              this.patchState({
                isLineChartLoading: false
              });
              this.uiStore.toggleGlobalLoading(false);

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
        this.uiStore.toggleGlobalLoading(true);
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
              this.uiStore.toggleGlobalLoading(false);
            },
            err => {
              this.patchState({
                isLineChartLoading: false
              });
              this.uiStore.toggleGlobalLoading(false);

            }
          ),
          catchError(() => EMPTY))
      )
    )
  );

  constructor(
    private dashboardService: DashboardService,
    private uiStore: UiStore
  ) {
    super(initialState);
  }

  public convertDataFormat(users: { id: number; name: string; created_at?: string; lastActive?: string }[], reqObj: { startDate: string; endDate: string, filterBy: DashboardRangeFilterEnum }, activeUser?: false): any {
    const filterBy = reqObj.filterBy;
    let dataLabels: ChartLabel;
    let dataSet: number[];
    let label;
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
        // @ts-ignore
        const date = users[0]?.created_at ? new Date(user.created_at).getDate() : new Date(user.lastActive).getDate();
        dataSet[date]++;
      }
      label = 'feb';
    } else if (filterBy === DashboardRangeFilterEnum.WEEKLY) {
      dataLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      dataSet = Array.from(Array(7).fill(0));
      for (const user of users) {
        // @ts-ignore
        const date = users[0]?.created_at ? new Date(user.created_at).getDay() : new Date(user.lastActive).getDay();
        dataSet[date]++;
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
    // @ts-ignore
    return { dataSet: [{ data: dataSet, label: label }], labels: dataLabels };
  }

  public convertToPercentage(female: [], male: [], other: [], totalUsers: number | undefined): SingleOrMultiDataSet {
    if (!totalUsers) {
      return [[0, 0, 0]];
    }
    const noOfMaleUsers = parseInt(((male.length / totalUsers) * 100).toFixed(2));
    const noOfFemaleUsers = parseInt(((female.length / totalUsers) * 100).toFixed(2));
    const noOfOtherUsers = parseInt(((other.length / totalUsers) * 100).toFixed(2));
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
