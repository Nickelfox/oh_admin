import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { DashboardData } from './models/dashboard.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DashboardService } from './services/dashboard.service';

export interface DashboardState extends Partial<DashboardData> {
  isLoading?: boolean;
}

const initialState: DashboardState = {
  isLoading: false,
  totalUser: 0
};

@Injectable()
export class DashboardStore extends ComponentStore<DashboardState> {

  readonly isChangeLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly totalUsers$: Observable<number> = this.select(state => state.totalUser ?? 0);

  readonly getStats = this.effect<DashboardData>(params$ =>
    params$.pipe(
      tap(() => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap(() =>
        this.dashboardService.getStatistics().pipe(
          tap(
            (apiRes) => {
              this.patchState({
                isLoading: false,
                totalUser: apiRes.totalUser
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

  constructor(
    private dashboardService: DashboardService
  ) {
    super(initialState);
    this.getStats({
      totalUser: 0,
    });
  }
}
