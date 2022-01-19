import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Featured, FeaturedListingFilters } from '../models/featured.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { FeaturedService } from '../services/featured.service';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';

export interface FeaturedState {
  featuredList: Featured[];
  selectedFeatured?: Featured;
  isLoading?: boolean;
  isActing?: boolean;
  loaded?: boolean;
};

const initialState: FeaturedState = {
  featuredList: [],
  isLoading: false,
  isActing: false,
  loaded: false
};

@Injectable()
export class FeaturedStore extends ComponentStore<FeaturedState> {
  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly loaded$: Observable<boolean> = this.select(state => !!state.loaded);
  readonly isActing$: Observable<boolean> = this.select(state => !!state.isActing);
  readonly featuredList$: Observable<Featured[]> = this.select(state => state.featuredList || []);
  readonly selectedFeatured$: Observable<Featured | undefined> = this.select(state => state.selectedFeatured);

  private toastRef: CreateHotToastRef<unknown> | undefined;

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
          catchError(() => {
            this.toastRef?.close();
            return EMPTY;
          })
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
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Populating Details...', {
          dismissible: false,
          role: 'status'
        });
      }),
      switchMap(({ id }) =>
        this.featuredService.getFeatured(id).pipe(
          tapResponse(
            (selectedFeatured) => {
              this.patchState({
                isLoading: false,
                loaded: true,
                selectedFeatured
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

  constructor(
    private featuredService: FeaturedService,
    private hotToastService: HotToastService,
  ) {
    super(initialState);
  }
}
