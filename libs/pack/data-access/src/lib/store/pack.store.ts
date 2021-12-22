import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Pack, PackListingRequest } from '../models/pack.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { PackService } from '../services/pack.service';

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

  constructor(
    private packService: PackService
  ) {
    super(initialState);
  }
}
