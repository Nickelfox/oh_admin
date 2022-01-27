import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  CreateTest,
  Test,
  TestDeleteRequest,
  TestListingRequest,
  TestPublishToggleRequest
} from '../models/test.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { MatDialog } from '@angular/material/dialog';
import { TestService } from '../services/test.service';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { GenericDialogPrompt } from '@hidden-innovation/shared/models';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';

export interface TestState {
  tests: Test[];
  selectedTest?: Test;
  total: number;
  isLoading?: boolean;
  isActing?: boolean;
  loaded?: boolean;
};

const initialState: TestState = {
  tests: [],
  total: 0,
  isLoading: false,
  isActing: false,
  loaded: false
};

@Injectable()
export class TestStore extends ComponentStore<TestState> {

  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly loaded$: Observable<boolean> = this.select(state => !!state.loaded);
  readonly isActing$: Observable<boolean> = this.select(state => !!state.isActing);
  readonly count$: Observable<number> = this.select(state => state.total || 0);
  readonly tests$: Observable<Test[]> = this.select(state => state.tests || []);
  readonly selectedTest$: Observable<Test | undefined> = this.select(state => state.selectedTest);

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
                loaded: true,
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
            (_) => {
              this.patchState({
                isActing: false,
                loaded: true
              });
              this.toastRef?.updateMessage('Test Created!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
                duration: 300
              });
              this.router.navigate(['/tests', 'listing', this.constantDataService.PaginatorData.pageSizeOptions[3], this.constantDataService.PaginatorData.pageIndex]);
            },
            _ => {
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

  updateTest$ = this.effect<{ test: CreateTest, id: number }>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Updating Test...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap(({ test, id }) =>
        this.testService.updateTest(test, id).pipe(
          tapResponse(
            (response) => {
              this.patchState({
                isActing: false,
                loaded: true,
                selectedTest: response
              });
              this.toastRef?.updateMessage('Questionnaire Updated!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
                duration: 300
              });
              this.router.navigate(['/tests', 'listing', this.constantDataService.PaginatorData.pageSizeOptions[3], this.constantDataService.PaginatorData.pageIndex]);
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

  getTestDetails$ = this.effect<{ id: number }>(params$ =>
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
      switchMap(({ id }) =>
        this.testService.getTest(id).pipe(
          tapResponse(
            (selectedTest) => {
              this.patchState({
                isLoading: false,
                selectedTest
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

  private togglePublishState$ = this.effect<TestPublishToggleRequest>(params$ =>
    params$.pipe(
      tap((state) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading(state.newState ? 'Publishing Test...' : 'Un-publishing Test...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap(({ id, newState }) =>
        this.testService.toggleTestPublishStatus(id).pipe(
          tapResponse(
            _ => {
              const tests: Test[] | undefined = this.get().tests;
              this.patchState({
                isActing: false,
                loaded: true,
                tests: tests.map(t => {
                  if (t.id === id) {
                    return {
                      ...t,
                      isPublished: newState
                    };
                  } else {
                    return t;
                  }
                })
              });
              this.toastRef?.updateMessage(newState ? 'Success! Test Published' : 'Success! Test Un-published');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success'
              });
            },
            _ => {
              this.toastRef?.close();
              this.patchState({
                isActing: false
              });
            }
          )
        )
      )
    )
  );
  private deleteTest$ = this.effect<TestDeleteRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Deleting Test...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap(({ id, pageSize, pageIndex, nameSort, dateSort, search, published, level, type, category }) =>
        this.testService.deleteTest(id).pipe(
          tapResponse(
            _ => {
              const tests: Test[] = this.get().tests;
              this.patchState({
                isActing: false,
                loaded: true,
                tests: tests.filter(t => t.id !== id)
              });
              this.toastRef?.updateMessage('Success! Test deleted');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success'
              });
              this.getTests$({
                page: pageIndex,
                limit: pageSize,
                nameSort,
                dateSort,
                search,
                published,
                level,
                type,
                category
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

  constructor(
    private router: Router,
    private hotToastService: HotToastService,
    private matDialog: MatDialog,
    private constantDataService: ConstantDataService,
    private testService: TestService
  ) {
    super(initialState);
  }

  toggleActive(id: number, currentState: boolean): void {
    const newState = !currentState;
    const dialogData: GenericDialogPrompt = {
      title: newState ? 'Publish Test?' : 'Un-publish Test?',
      desc: newState ? `Are you sure you want to publish this Test?` : 'This might impact various other modules .i.e. TestGroup, Packs etc.',
      action: {
        posTitle: 'Yes',
        negTitle: 'No',
        type: 'mat-primary'
      }
    };
    const dialogRef = this.matDialog.open(PromptDialogComponent, {
      data: dialogData,
      minWidth: '25rem'
    });
    dialogRef.afterClosed().subscribe((proceed: boolean) => {
      if (proceed) {
        this.togglePublishState$({
          id,
          newState
        });
      }
    });
  }

  deleteTest(deleteObj: TestDeleteRequest): void {
    const dialogData: GenericDialogPrompt = {
      title: 'Delete Test?',
      desc: `This might impact various other modules .i.e. TestGroup, Packs etc.`,
      action: {
        posTitle: 'Yes',
        negTitle: 'No',
        type: 'mat-warn'
      }
    };
    const dialogRef = this.matDialog.open(PromptDialogComponent, {
      data: dialogData,
      minWidth: '25rem'
    });
    dialogRef.afterClosed().subscribe((proceed: boolean) => {
      if (proceed) {
        this.deleteTest$(deleteObj);
      }
    });
  }
}
