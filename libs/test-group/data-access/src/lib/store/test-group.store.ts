import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { TestGroup, TestGroupListingRequest } from '../models/test-group.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TestGroupService } from '../services/test-group.service';
import { CreateHotToastRef } from '@ngneat/hot-toast';

export interface TestGroupState {
  testGroups: TestGroup[];
  selectedGroup?: TestGroup;
  total: number;
  isLoading?: boolean;
  isActing?: boolean;
  loaded?: boolean;
};

const initialState: TestGroupState = {
  testGroups: [],
  total: 0,
  isLoading: false,
  isActing: false,
  loaded: false
};

@Injectable()
export class TestGroupStore extends ComponentStore<TestGroupState> {

  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly loaded$: Observable<boolean> = this.select(state => !!state.loaded);
  readonly isActing$: Observable<boolean> = this.select(state => !!state.isActing);
  readonly count$: Observable<number> = this.select(state => state.total || 0);
  readonly testGroups$: Observable<TestGroup[]> = this.select(state => state.testGroups || []);

  getTestGroups$ = this.effect<TestGroupListingRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap((reqObj) =>
        this.testGroupService.getTestGroups(reqObj).pipe(
          tapResponse(
            ({ test_groups, count }) => {
              this.patchState({
                isLoading: false,
                loaded: true,
                testGroups: test_groups,
                total: count
              });
            },
            _ => {
              this.patchState({
                isLoading: false
              });
            }
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  private toastRef: CreateHotToastRef<unknown> | undefined;


  constructor(
    private testGroupService: TestGroupService
  ) {
    super(initialState);
  }
}
