import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Featured, FeaturedContent, FeaturedListingFilters } from '../models/featured.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { FeaturedService } from '../services/featured.service';

export interface FeaturedState {
  featuredList: Featured[];
  featuredContents?: FeaturedContent[];
  selectedFeatured?: Featured;
  isLoading?: boolean;
  isContentLoading?: boolean;
  isActing?: boolean;
  loaded?: boolean;
};

const initialState: FeaturedState = {
  featuredList: [],
  featuredContents: [],
  isLoading: false,
  isActing: false,
  loaded: false
};

@Injectable()
export class FeaturedStore extends ComponentStore<FeaturedState> {
  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly isContentLoading$: Observable<boolean> = this.select(state => !!state.isContentLoading);
  readonly loaded$: Observable<boolean> = this.select(state => !!state.loaded);
  readonly isActing$: Observable<boolean> = this.select(state => !!state.isActing);
  readonly featuredList$: Observable<Featured[]> = this.select(state => state.featuredList || []);
  readonly featuredContents$: Observable<FeaturedContent[]> = this.select(state => state.featuredContents || []);
  readonly selectedFeatured$: Observable<Featured | undefined> = this.select(state => state.selectedFeatured);

  getFeaturedList$ = this.effect<FeaturedListingFilters>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap((reqObj) =>
        this.featuredService.getFeaturedList(reqObj).pipe(
          tapResponse(
            (featuredList) => {
              this.patchState({
                isLoading: false,
                loaded: true,
                featuredList
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

  getFeaturedDetails$ = this.effect<{ id: number }>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap(({ id }) =>
        this.featuredService.getFeatured(id).pipe(
          tapResponse(
            (selectedFeatured) => {
              this.patchState({
                isLoading: false,
                selectedFeatured
              });

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

  constructor(
    private featuredService: FeaturedService
  ) {
    super(initialState);
  }
}
