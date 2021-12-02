import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Test, TestListingRequest } from '../models/test.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { MatDialog } from '@angular/material/dialog';
import { TestService } from '../services/test.service';

export interface TestState {
  tests: Test[];
  total: number;
  isLoading?: boolean;
  isActing?: boolean;
};

const initialState: TestState = {
  tests: [],
  total: 0,
  isLoading: false,
  isActing: false
};

@Injectable()
export class TestStore extends ComponentStore<TestState> {

  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly isActing$: Observable<boolean> = this.select(state => !!state.isActing);
  readonly count$: Observable<number> = this.select(state => state.total || 0);
  readonly tests$: Observable<Test[]> = this.select(state => state.tests || []);

  getTests$ = this.effect<TestListingRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap((reqObj) =>
        this.testService.getTests(reqObj).pipe(
          tapResponse(
            ({ tests, total }) => {
              this.patchState({
                isLoading: false,
                tests,
                total
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

  constructor(
    private router: Router,
    private hotToastService: HotToastService,
    private matDialog: MatDialog,
    private testService: TestService
  ) {
    super(initialState);
  }
}
