import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { EMPTY, Observable } from 'rxjs';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { GoalsService } from '../services/goals.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Goals } from '../models/goals.interface';

export interface GoalState {
  selectedGoal?: Goals;
  isLoading?: boolean;
  isActing?: boolean;
  loaded?: boolean;
};

const initialState: GoalState = {
  isLoading: false,
  isActing: false,
  loaded: false
};

@Injectable()
export class GoalStore extends ComponentStore<GoalState> {
  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly loaded$: Observable<boolean> = this.select(state => !!state.loaded);
  readonly isActing$: Observable<boolean> = this.select(state => !!state.isActing);
  readonly selectedGoal$: Observable<Goals | undefined> = this.select(state => state.selectedGoal);

  private toastRef: CreateHotToastRef<unknown> | undefined;

  getGoalDetail$ = this.effect(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Populating Details...', {
          dismissible: false,
          role: 'status'
        });
      }),
      switchMap(() =>
        this.goalsService.getGoal().pipe(
          tapResponse(
            (selectedGoal) => {
              this.patchState({
                isLoading: false,
                loaded: true,
                selectedGoal
              });
              this.toastRef?.close();
            },
            (_) => {
              this.patchState({
                isLoading: false
              });
              this.toastRef?.close();
            }
          ),
          catchError(() => {
            this.toastRef?.close();
            return EMPTY;
          })
        )
      )
    )
  );

  constructor(
    private goalsService: GoalsService,
    private hotToastService: HotToastService,
    private router: Router
  ) {
    super(initialState);
  }

}
