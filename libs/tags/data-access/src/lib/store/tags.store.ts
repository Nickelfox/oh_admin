import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Tag, TagsListingRequest } from '../models/tags.interface';
import { EMPTY, Observable } from 'rxjs';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TagsService } from '../services/tags.service';

export interface TagsState {
  tags: Tag[];
  total: number;
  isLoading?: boolean;
  isActing?: boolean;
}

const initialState: TagsState = {
  tags: [],
  total: 0,
  isLoading: false,
  isActing: false
};

@Injectable()
export class TagsStore extends ComponentStore<TagsState> {

  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly isActing$: Observable<boolean> = this.select(state => !!state.isActing);
  readonly count$: Observable<number> = this.select(state => state.total || 0);

  getTags$ = this.effect<TagsListingRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap(({ page, limit }) =>
        this.tagsService.getTags({ page, limit }).pipe(
          tapResponse(
            ({ tags, total }) => {
              this.patchState({
                isLoading: false,
                tags,
                total
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

  constructor(
    private router: Router,
    private hotToastService: HotToastService,
    private matDialog: MatDialog,
    private tagsService: TagsService
  ) {
    super(initialState);
  }
}
