import {Injectable} from '@angular/core';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {Assessment} from "../models/assessment.interface";
import {EMPTY, Observable} from 'rxjs';
import {catchError, exhaustMap, switchMap, tap} from 'rxjs/operators';
import {CreateHotToastRef, HotToastService} from '@ngneat/hot-toast';
import {Router} from '@angular/router';
import {AssessmentService} from "../services/assessment.service";

export interface AssessmentState {
  assessmentList: Assessment[];
  selectedAssessment?: Assessment;
  isLoading?: boolean;
  isActing?: boolean;
  loaded?: boolean;
};

const initialState: AssessmentState = {
  assessmentList: [],
  isLoading: false,
  isActing: false,
  loaded: false
};

@Injectable()
export class AssessmentStore extends ComponentStore<AssessmentState> {

  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly loaded$: Observable<boolean> = this.select(state => !!state.loaded);
  readonly isActing$: Observable<boolean> = this.select(state => !!state.isActing);
  readonly assessmentList$: Observable<Assessment[]> = this.select(state => state.assessmentList || []);
  readonly selectedAssessment$: Observable<Assessment | undefined> = this.select(state => state.selectedAssessment);

  private toastRef: CreateHotToastRef<unknown> | undefined;

  getAssessmentList$ = this.effect(params$ =>
    params$.pipe(
      tap(() => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap(() =>
        this.assessmentService.getAssessmentList().pipe(
          tapResponse(
            (assessmentList) => {
              this.patchState({
                isLoading: false,
                loaded: true,
                assessmentList
              });
            },
            _ => {
              this.patchState({
                isLoading: false
              });
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

  constructor(
    private assessmentService: AssessmentService,
    private hotToastService: HotToastService,
    private router: Router,
  ) {
    super(initialState);
  }
}
