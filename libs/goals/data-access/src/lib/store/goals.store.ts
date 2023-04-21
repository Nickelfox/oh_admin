import {Injectable} from '@angular/core';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {EMPTY, Observable} from 'rxjs';
import {CreateHotToastRef, HotToastService} from '@ngneat/hot-toast';
import {Router} from '@angular/router';
import {GoalsService} from '../services/goals.service';
import {catchError, exhaustMap, switchMap, tap} from 'rxjs/operators';
import {Goals, GoalsCore} from '../models/goals.interface';
import {Pack, PackDeleteRequest} from "@hidden-innovation/pack/data-access";
import {GenericDialogPrompt} from "@hidden-innovation/shared/models";
import {PromptDialogComponent} from "@hidden-innovation/shared/ui/prompt-dialog";

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

  updateGoals$ = this.effect<GoalsCore>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Updating Goals...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap((goalObj) =>
        this.goalsService.updateGoal(goalObj).pipe(
          tapResponse(
            _ => {
              this.patchState({
                isActing: false,
                loaded: true,
              });
              this.toastRef?.updateMessage('Goals Updated!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
              });
            },
            _ => {
              this.toastRef?.close();
              this.patchState({
                isActing: false
              });
            }
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  private deleteGoalAnswer$ = this.effect<number | undefined>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Deleting Goal Answer...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap((id) =>
        this.goalsService.deleteGoalAnswer(id).pipe(
          tapResponse(
            _ => {
              this.patchState({
                isActing: false,
                loaded: true,
              });
              this.toastRef?.updateMessage('Success! Goal answer deleted');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success'
              });
              this.goalsService.getGoal().subscribe((response) => {
                this.patchState({
                  selectedGoal: response
                })
              })
            },
            _ => {
              this.toastRef?.close();
              this.patchState({
                isActing: false
              });
            }
          ),
          catchError(() => EMPTY)
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


  deleteGoalsAnswer(id: number | undefined): void {
    this.deleteGoalAnswer$(id)
  }


}


