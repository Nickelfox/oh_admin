import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { EMPTY, Observable } from 'rxjs';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { SportActivities } from '../models/sport-activities.interface';
import { SportActivitiesService } from '../services/sport-activities.service';

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


  constructor(
    private sportActivitiesService: SportActivitiesService,
    private hotToastService: HotToastService,
    private router: Router
  ) {
    super(initialState);
  }

}
