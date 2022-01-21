import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { DashboardData } from './models/dashboard.interface';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { catchError, delay, last, skipUntil, switchMap, tap } from 'rxjs/operators';
import { DashboardService } from './services/dashboard.service';
import { UiStore } from '@hidden-innovation/shared/store';
import { ChartDatasets, SingleOrMultiDataSet } from "@rinminase/ng-charts";
import { TagCategoryEnum } from "@hidden-innovation/shared/models";

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
};

@Injectable()
export class DashboardStore extends ComponentStore<DashboardState> {

  readonly isChangeLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
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
            catchError(() => EMPTY)),

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
                completeTestEngagementLables: dataSet.label,
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
                assessmentTestEngagementLables: dataSet.label,
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

  constructor(
    private dashboardService: DashboardService,
    private uiStore: UiStore
  ) {
    super(initialState);
    this.getStats();
    this.getCompleteTestEngagement();
    this.getAssessmentTestEngagement();
  }

  public convertToPercentage(female: [], male: [], other: [], totalUsers: number | undefined): SingleOrMultiDataSet {
    this.uiStore
    if (!totalUsers) {
      return [[0, 0, 0]]
    }
    const noOfMaleUsers = parseInt(((male.length / totalUsers) * 100).toFixed(2));
    const noOfFemaleUsers = parseInt(((female.length / totalUsers) * 100).toFixed(2));
    const noOfOtherUsers = parseInt(((other.length / totalUsers) * 100).toFixed(2));
    return [[noOfMaleUsers, noOfFemaleUsers, noOfOtherUsers]]
  }


  public completeTestEngagementDataSet(tests: { userPercentage: number; name: string }[]): { data: number[], label: string[] } {
    const label = [];
    const data = []
    const sortedTestByScore = tests.sort((a, b) => b.userPercentage - a.userPercentage).slice(0, 6);
    for (const test of sortedTestByScore) {
      label.push(test.name);
      data.push(test.userPercentage);
    }
    return { data, label }
  }

  public assessmentTestEngagementDataSet(category: { [key in TagCategoryEnum]: number }): { data: number[], label: string[] } {
    const label = Object.keys(category);
    const data = Object.values(category);
    return { data, label }
  }

  public convertToChartData(users: { id: number; age: number; gender: string }[]): ChartDatasets {
    if (!users) {
      return [{ data: [], label: '' }]
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
      } else if (user.age >= 35 && user.age <= 44) {
        data[3] += 1;
      }
    }
    return [{ data, label }];
  }
}
