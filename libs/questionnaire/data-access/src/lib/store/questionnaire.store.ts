import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  Questionnaire,
  QuestionnaireActiveToggleRequest,
  QuestionnaireDeleteRequest,
  QuestionnaireExtended,
  QuestionnaireListingRequest
} from '../models/questionnaire.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { QuestionnaireService } from '../services/questionnaire.service';
import { Router } from '@angular/router';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { GenericDialogPrompt } from '@hidden-innovation/shared/models';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';
import { MatDialog } from '@angular/material/dialog';
import { delay } from 'lodash-es';

export interface QuestionnaireState {
  questionnaires: QuestionnaireExtended[];
  selectedQuestionnaire?: QuestionnaireExtended;
  total: number;
  isLoading?: boolean;
  isActing?: boolean;
  loaded?: boolean;
}

const initialState: QuestionnaireState = {
  questionnaires: [],
  total: 0,
  isLoading: false,
  isActing: false,
  loaded: false
};

@Injectable()
export class QuestionnaireStore extends ComponentStore<QuestionnaireState> {

  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly loaded$: Observable<boolean> = this.select(state => !!state.loaded);
  readonly isActing$: Observable<boolean> = this.select(state => !!state.isActing);
  readonly count$: Observable<number> = this.select(state => state.total || 0);
  readonly selectedQuestionnaire$: Observable<QuestionnaireExtended | undefined> = this.select(state => state.selectedQuestionnaire);
  getQuestionnaires$ = this.effect<QuestionnaireListingRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap((listObj) =>
        this.questionnaireService.getQuestionnaires(listObj).pipe(
          tapResponse(
            ({ questionnaire, count }) => {
              this.patchState({
                isLoading: false,
                loaded: true,
                questionnaires: questionnaire,
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
  getQuestionnaireDetails$ = this.effect<{ id: number }>(params$ =>
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
        this.questionnaireService.getQuestionnaire(id).pipe(
          tapResponse(
            (selectedQuestionnaire) => {
              this.patchState({
                isLoading: false,
                selectedQuestionnaire
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
  createQuestionnaire$ = this.effect<Questionnaire>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Creating new Questionnaire...', {
          dismissible: false,
          autoClose:false,
          role: 'status'
        });
      }),
      exhaustMap((questionnaire) =>
        this.questionnaireService.createQuestionnaire(questionnaire).pipe(
          tapResponse(
            (response) => {
              this.patchState({
                isActing: false,
                loaded: true
              });
              this.toastRef?.updateMessage('Questionnaire Created!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
                duration: 300
              });
              delay(_ => this.toastRef?.close(), 3000);
              this.router.navigate(['/questionnaire', 'listing', this.constantDataService.PaginatorData.pageSize, this.constantDataService.PaginatorData.pageIndex]);
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

  updateQuestionnaire$ = this.effect<{ questionnaire: Questionnaire, id: number }>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Updating Questionnaire...', {
          dismissible: false,
          autoClose:false,
          role: 'status'
        });
      }),
      exhaustMap(({ questionnaire, id }) =>
        this.questionnaireService.updateQuestionnaire(questionnaire, id).pipe(
          tapResponse(
            (response) => {
              this.patchState({
                isActing: false,
                loaded: true,
                selectedQuestionnaire: response
              });
              this.toastRef?.updateMessage('Questionnaire Updated!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
                duration: 300
              });
              delay(_ => this.toastRef?.close(), 3000);
              this.router.navigate(['/questionnaire', 'listing', this.constantDataService.PaginatorData.pageSize, this.constantDataService.PaginatorData.pageIndex]);
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

  private toggleActiveState$ = this.effect<QuestionnaireActiveToggleRequest>(params$ =>
    params$.pipe(
      tap((state) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading(state.newState ? 'Activating Questionnaire...' : 'Deactivating Questionnaire...', {
          dismissible: false,
          autoClose:false,
          role: 'status'
        });
      }),
      exhaustMap(({ id, newState }) =>
        this.questionnaireService.toggleActiveQuestionnaire(id).pipe(
          tapResponse(
            (_) => {
              const questionnaires: QuestionnaireExtended[] | undefined = this.get().questionnaires;
              this.patchState({
                isActing: false,
                loaded: true,
                questionnaires: questionnaires.map(q => {
                  if (q.id === id) {
                    return {
                      ...q,
                      isActive: newState
                    };
                  } else {
                    return q;
                  }
                })
              });
              this.toastRef?.updateMessage(newState ? 'Success! Questionnaire Activated' : 'Success! Questionnaire Deactivated');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success'
              });
              delay(_ => this.toastRef?.close(), 3000);
            },
            (_) => {
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

  private deleteQuestionnaire$ = this.effect<QuestionnaireDeleteRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Deleting Questionnaire...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap(({ id, pageIndex, pageSize, nameSort, active, scoring, dateSort, search }) =>
        this.questionnaireService.deleteQuestionnaire(id).pipe(
          tapResponse(
            (_) => {
              const questionnaires: QuestionnaireExtended[] | undefined = this.get().questionnaires;
              this.patchState({
                isActing: false,
                loaded: true,
                questionnaires: questionnaires.filter(q => q.id !== id)
              });
              this.toastRef?.updateMessage('Success! Questionnaire deleted');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success'
              });
              this.getQuestionnaires$({
                page: pageIndex,
                limit: pageSize,
                nameSort,
                active,
                scoring,
                dateSort,
                search
              });
            },
            (_) => {
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
    private questionnaireService: QuestionnaireService,
    private constantDataService: ConstantDataService
  ) {
    super(initialState);
  }

  toggleActive(id: number, currentState: boolean): void {
    const newState = !currentState;
    const dialogData: GenericDialogPrompt = {
      title: newState ? 'Activate Questionnaire?' : 'Deactivate Questionnaire?',
      desc: newState ? `Are you sure you want to activate this Questionnaire?` : 'This might impact various other modules .i.e. Packs, Assessments etc.',
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
        this.toggleActiveState$({
          id,
          newState
        });
      }
    });
  }

  deleteQuestionnaire(deleteObj: QuestionnaireDeleteRequest): void {
    const { id, pageSize, pageIndex, active, dateSort, nameSort, scoring, search } = deleteObj;
    const dialogData: GenericDialogPrompt = {
      title: 'Delete Questionnaire?',
      desc: `This might impact various other modules .i.e. Packs, Assessments etc.`,
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
        this.deleteQuestionnaire$({
          id,
          pageSize,
          pageIndex,
          nameSort,
          active,
          scoring,
          dateSort,
          search
        });
      }
    });
  }
}
