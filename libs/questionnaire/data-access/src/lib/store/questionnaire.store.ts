import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Questionnaire, QuestionnaireListingRequest } from '../models/questionnaire.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { QuestionnaireService } from '../services/questionnaire.service';
import { Router } from '@angular/router';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';

export interface QuestionnaireState {
  questionnaires?: Questionnaire[];
  selectedQuestionnaire?: Questionnaire;
  total?: number;
  isLoading?: boolean;
  isActing?: boolean;
}

const initialState: QuestionnaireState = {
  questionnaires: [],
  total: 0,
  isLoading: false,
  isActing: false
};

@Injectable()
export class QuestionnaireStore extends ComponentStore<QuestionnaireState> {

  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly isActing$: Observable<boolean> = this.select(state => !!state.isActing);
  readonly count$: Observable<number> = this.select(state => state.total || 0);
  getQuestionnaires$ = this.effect<QuestionnaireListingRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap(({ page, limit }) =>
        this.questionnaireService.getQuestionnaires({ page, limit }).pipe(
          tapResponse(
            ({ questionnaire, count }) => {
              this.patchState({
                isLoading: false,
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
  createQuestionnaire$ = this.effect<Questionnaire>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Creating new Questionnaire...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap((questionnaire) =>
        this.questionnaireService.createQuestionnaire(questionnaire).pipe(
          tapResponse(
            (response) => {
              let questionnaires: Questionnaire[] = this.get().questionnaires ?? [];
              let total: number = this.get().total ?? 0;
              questionnaires = [response, ...questionnaires];
              this.patchState({
                isActing: false,
                questionnaires,
                total: total++
              });
              this.toastRef?.updateMessage('Questionnaire Created!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
                duration: 300
              });
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


  constructor(
    private router: Router,
    private hotToastService: HotToastService,
    private questionnaireService: QuestionnaireService,
    private constantDataService: ConstantDataService
  ) {
    super(initialState);
  }
}
