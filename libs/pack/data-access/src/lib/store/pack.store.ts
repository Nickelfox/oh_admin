import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Pack, PackCore, PackListingRequest } from '../models/pack.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { PackService } from '../services/pack.service';
import { Router } from '@angular/router';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { MatDialog } from '@angular/material/dialog';
import { Test } from '@hidden-innovation/test/data-access';
import { TestGroup } from '@hidden-innovation/test-group/data-access';
import { QuestionnaireExtended } from '@hidden-innovation/questionnaire/data-access';
import { Lesson } from '../models/lesson.interface';

export interface PackState {
  packs: Pack[];
  total: number;
  isLoading?: boolean;
  isActing?: boolean;
  loaded?: boolean;
};

const initialState: PackState = {
  packs: [],
  total: 0,
  isLoading: false,
  isActing: false,
  loaded: false
};

@Injectable()
export class PackStore extends ComponentStore<PackState> {

  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly loaded$: Observable<boolean> = this.select(state => !!state.loaded);
  readonly isActing$: Observable<boolean> = this.select(state => !!state.isActing);
  readonly count$: Observable<number> = this.select(state => state.total || 0);
  readonly packs$: Observable<Pack[]> = this.select(state => state.packs || []);

  getPacks$ = this.effect<PackListingRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap((reqObj) =>
        this.packService.getPacks(reqObj).pipe(
          tapResponse(
            ({ packs, count }) => {
              this.patchState({
                isLoading: false,
                loaded: true,
                packs,
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

  createPack$ = this.effect<PackCore>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Creating new Pack...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap((pack) =>
        this.packService.createPack(pack).pipe(
          tapResponse(
            (_) => {
              this.patchState({
                isActing: false,
                loaded: true
              });
              this.toastRef?.updateMessage('Pack Created!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
                duration: 300
              });
              this.router.navigate(['/packs']);
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

  constructor(
    private packService: PackService,
    private router: Router,
    private hotToastService: HotToastService,
    private matDialog: MatDialog
  ) {
    super(initialState);
  }
}
