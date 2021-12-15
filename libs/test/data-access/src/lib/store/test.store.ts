import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { CreateTest, Test, TestListingRequest } from '../models/test.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { MatDialog } from '@angular/material/dialog';
import { TestService } from '../services/test.service';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';

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
  private toastRef: CreateHotToastRef<unknown> | undefined;
  createTest$ = this.effect<CreateTest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Creating new Test...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap((test) =>
        this.testService.createTest(test).pipe(
          tapResponse(
            (response) => {
              this.patchState({
                isActing: false
              });
              this.toastRef?.updateMessage('Test Created!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
                duration: 300
              });
              this.router.navigate(['/tests', 'listing', this.constantDataService.PaginatorData.pageSize, this.constantDataService.PaginatorData.pageIndex]);
            },
            error => {
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
    private router: Router,
    private hotToastService: HotToastService,
    private matDialog: MatDialog,
    private constantDataService: ConstantDataService,
    private testService: TestService
  ) {
    super(initialState);
  }
}
