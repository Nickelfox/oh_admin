import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Featured, FeaturedCore } from '../models/featured.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { FeaturedService } from '../services/featured.service';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

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

  getFeaturedList$ = this.effect(params$ =>
    params$.pipe(
      tap(() => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap(() =>
        this.featuredService.getFeaturedList().pipe(
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

  updateFeatured$ = this.effect<{ id: number, featured: FeaturedCore }>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Updating Featured...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap(({ featured, id }) =>
        this.featuredService.updateFeatured(id, featured).pipe(
          tapResponse(
            (selectedFeatured) => {
              this.patchState({
                isActing: false,
                loaded: true,
                selectedFeatured
              });
              this.toastRef?.updateMessage('Featured Updated!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
                duration: 300
              });
              this.router.navigate(['/featured']);
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
    private featuredService: FeaturedService,
    private hotToastService: HotToastService,
    private router: Router,
  ) {
    super(initialState);
  }
}
