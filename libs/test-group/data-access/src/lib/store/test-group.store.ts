import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  TestGroup,
  TestGroupCore,
  TestGroupDeleteRequest,
  TestGroupListingRequest,
  TestGroupPublishToggleRequest
} from '../models/test-group.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { TestGroupService } from '../services/test-group.service';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { GenericDialogPrompt } from '@hidden-innovation/shared/models';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';

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
  readonly selectedTestGroup$: Observable<TestGroup | undefined> = this.select(state => state.selectedGroup);

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

  createTestGroup$ = this.effect<TestGroupCore>(params$ =>
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
      exhaustMap((testGroup) =>
        this.testGroupService.createTestGroup(testGroup).pipe(
          tapResponse(
            (_) => {
              this.patchState({
                isActing: false,
                loaded: true
              });
              this.toastRef?.updateMessage('Test Group Created!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
                duration: 300
              });
              this.router.navigate(['/tests-group']);
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

  getTestGroupDetails$ = this.effect<{ id: number }>(params$ =>
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
        this.testGroupService.getTestGroup(id).pipe(
          tapResponse(
            (selectedGroup) => {
              this.patchState({
                isLoading: false,
                selectedGroup
              });
              this.toastRef?.close();
            },
            (_) => {
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

  updateTestGroup$ = this.effect<{ testGroup: TestGroupCore, id: number }>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Updating Test Group...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap(({ testGroup, id }) =>
        this.testGroupService.updateTestGroup(id, testGroup).pipe(
          tapResponse(
            (selectedGroup) => {
              this.patchState({
                isActing: false,
                loaded: true,
                selectedGroup
              });
              this.toastRef?.updateMessage('Test Group Updated!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
                duration: 300
              });
              this.router.navigate(['/tests-group']);
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

  private togglePublishState$ = this.effect<TestGroupPublishToggleRequest>(params$ =>
    params$.pipe(
      tap((state) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading(state.newState ? 'Publishing Test Group...' : 'Un-publishing Test Group...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap(({ id, newState }) =>
        this.testGroupService.toggleTestPublishStatus(id).pipe(
          tapResponse(
            _ => {
              const tgs: TestGroup[] | undefined = this.get().testGroups;
              this.patchState({
                isActing: false,
                loaded: true,
                testGroups: tgs.map(t => {
                  if (t.id === id) {
                    return {
                      ...t,
                      isVisible: newState
                    };
                  } else {
                    return t;
                  }
                })
              });
              this.toastRef?.updateMessage(newState ? 'Success! Test Group Published' : 'Success! Test Group Un-published');
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
  private deleteTestGroup$ = this.effect<TestGroupDeleteRequest>(params$ =>
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
      exhaustMap(({ id, pageSize, pageIndex, nameSort, dateSort, search, published, category }) =>
        this.testGroupService.deleteTestGroup(id).pipe(
          tapResponse(
            _ => {
              const tgs: TestGroup[] = this.get().testGroups;
              this.patchState({
                isActing: false,
                loaded: true,
                testGroups: tgs.filter(t => t.id !== id)
              });
              this.toastRef?.updateMessage('Success! Test deleted');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success'
              });
              this.getTestGroups$({
                page: pageIndex,
                limit: pageSize,
                nameSort,
                dateSort,
                search,
                published,
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
    private testGroupService: TestGroupService,
    private router: Router,
    private hotToastService: HotToastService,
    private matDialog: MatDialog,
    private constantDataService: ConstantDataService
  ) {
    super(initialState);
  }

  toggleActive(id: number, currentState: boolean): void {
    const newState = !currentState;
    const dialogData: GenericDialogPrompt = {
      title: newState ? 'Publish Test Group?' : 'Un-publish Test Group?',
      desc: `Are you sure you want to ${newState ? 'publish this Test Group' : 'un-publish this Test Group'}?`,
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

  deleteTestGroup(deleteObj: TestGroupDeleteRequest): void {
    const dialogData: GenericDialogPrompt = {
      title: 'Delete Test Group?',
      desc: `Are you sure you want to delete this Test Group?`,
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
        this.deleteTestGroup$(deleteObj);
      }
    });
  }
}
