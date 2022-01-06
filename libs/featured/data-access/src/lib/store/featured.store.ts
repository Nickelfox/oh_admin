import { Injectable } from '@angular/core';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {Featured, FeaturedContent, FeaturedListingRequest} from "@hidden-innovation/featured/data-access";
import {EMPTY, Observable} from "rxjs";
import {catchError, switchMap, tap} from "rxjs/operators";
import {FeaturedService} from "../services/featured.service";

export interface FeaturedState {
  featureds: Featured[];
  featuredContents?: FeaturedContent[];
  selectedFeatured?: Featured;
  total: number;
  isLoading?: boolean;
  isContentLoading?: boolean;
  isActing?: boolean;
  loaded?: boolean;
};

const initialState: FeaturedState = {
  featureds: [],
  featuredContents: [],
  total: 0,
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
  readonly count$: Observable<number> = this.select(state => state.total || 0);
  readonly featureds$: Observable<Featured[]> = this.select(state => state.featureds || []);
  readonly featuredContents$: Observable<FeaturedContent[]> = this.select(state => state.featuredContents || []);
  readonly selectedfeatured$: Observable<Featured | undefined> = this.select(state => state.selectedFeatured);

  getFeatureds$ = this.effect<FeaturedListingRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap((reqObj) =>
        this.featuredService.getFeatureds(reqObj).pipe(
          tapResponse(
            ({ featureds, count }) => {
              this.patchState({
                isLoading: false,
                loaded: true,
                featureds,
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
    private featuredService: FeaturedService
  ) {
    super(initialState);
  }
}
