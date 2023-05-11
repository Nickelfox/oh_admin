import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { EMPTY, Observable } from 'rxjs';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import {SportActivities, SportActivitiesCore} from '../models/sportsActivities.interface';
import { SportActivitiesService } from '../services/sportsActivities.service';
import {catchError, exhaustMap, switchMap, tap} from "rxjs/operators";
import {GoalsCore} from "@hidden-innovation/goals/data-access";

export interface SportActivitiesState {
  selectedSportActivities?: SportActivities;
  isLoading?: boolean;
  isActing?: boolean;
  loaded?: boolean;
};

const initialState: SportActivitiesState = {
  isLoading: false,
  isActing: false,
  loaded: false
};

@Injectable()
export class SportActivitiesStore extends ComponentStore<SportActivitiesState> {
  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly loaded$: Observable<boolean> = this.select(state => !!state.loaded);
  readonly isActing$: Observable<boolean> = this.select(state => !!state.isActing);
  readonly selectedSportActivities$: Observable<SportActivities | undefined> = this.select(state => state.selectedSportActivities);

  private toastRef: CreateHotToastRef<unknown> | undefined;

  getSportsActivities$ = this.effect(params$ =>
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
        this.sportsActivitiesService.getSportsActivities().pipe(
          tapResponse(
            (selectedSportActivities) => {
              this.patchState({
                isLoading: false,
                loaded: true,
                selectedSportActivities
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

  updateSportsActivities$ = this.effect<SportActivitiesCore>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Updating Sport and Activities...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap((sportObj) =>
        this.sportsActivitiesService.updateSportsActivities(sportObj).pipe(
          tapResponse(
            _ => {
              this.patchState({
                isActing: false,
                loaded: true,
              });
              this.toastRef?.updateMessage('Sports Activities Updated!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
              });
              this.sportsActivitiesService.getSportsActivities().subscribe((response) => {
                this.patchState({
                  selectedSportActivities: response
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

  private deleteSportsActivities$ = this.effect<number | undefined>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Deleting Sport and Activities Answer...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap((id) =>
        this.sportsActivitiesService.deleteSportsActivities(id).pipe(
          tapResponse(
            _ => {
              this.patchState({
                isActing: false,
                loaded: true,
              });
              this.toastRef?.updateMessage('Success! Sports Activity answer deleted');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success'
              });
              this.sportsActivitiesService.getSportsActivities().subscribe((response) => {
                this.patchState({
                  selectedSportActivities: response
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
    private sportsActivitiesService: SportActivitiesService,
    private hotToastService: HotToastService,
    private router: Router
  ) {
    super(initialState);
  }

  deleteSportActivityAnswer(id: number | undefined): void {
    this.deleteSportsActivities$(id)
  }

}
