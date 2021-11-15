import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { CreateTagRequest, Tag, TagsListingRequest } from '../models/tags.interface';
import { EMPTY, Observable } from 'rxjs';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TagsService } from '../services/tags.service';
import { QuestionnaireDeleteRequest } from '@hidden-innovation/questionnaire/data-access';
import { GenericDialogPrompt } from '@hidden-innovation/shared/models';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';

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

  createTag$ = this.effect<CreateTagRequest>(param$ =>
    param$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Creating new Tag...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap(({ tag, pageIndex, pageSize }) =>
        this.tagsService.createTag(tag).pipe(
          tapResponse(
            (newTag) => {
              this.patchState({
                isActing: false,
                tags: [newTag, ...this.get().tags]
              });
              this.toastRef?.updateMessage('Tag Created!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
                duration: 300
              });
              this.getTags$({
                page: pageIndex,
                limit: pageSize
              });
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

  updateTag$ = this.effect<Tag>(param$ =>
    param$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Updating Tag...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap((tag) =>
        this.tagsService.updateTag(tag).pipe(
          tapResponse(
            ({ tagType, categoryName, name }) => {
              const tags: Tag[] = this.get().tags.map(t => {
                if (t.id === tag.id) {
                  return {
                    ...t,
                    tagType,
                    categoryName,
                    name
                  };
                } else {
                  return t;
                }
              });
              this.patchState({
                isActing: false,
                tags: tags
              });
              this.toastRef?.updateMessage('Tag Updated!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
                duration: 300
              });
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

  private deleteTag$ = this.effect<QuestionnaireDeleteRequest>(params =>
    params.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Deleting Tag...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap(({ id, pageIndex, pageSize }) =>
        this.tagsService.deleteTag(id).pipe(
          tapResponse(
            (_) => {
              const tags: Tag[] | undefined = this.get().tags;
              this.patchState({
                isActing: false,
                tags: tags.filter(t => t.id !== id)
              });
              this.toastRef?.updateMessage('Success! Tag deleted');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success'
              });
              this.getTags$({
                page: pageIndex,
                limit: pageSize
              });
            },
            (_) => {
              this.toastRef?.close();
              this.patchState({
                isActing: false
              });
            }
          )
        )
      )
    )
  );

  constructor(
    private router: Router,
    private hotToastService: HotToastService,
    private matDialog: MatDialog,
    private tagsService: TagsService
  ) {
    super(initialState);
  }

  deleteTag(id: number, pageSize: number, pageIndex: number): void {
    const dialogData: GenericDialogPrompt = {
      title: 'Delete Tag?',
      desc: `Are you sure you want to delete this Tag?`,
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
        this.deleteTag$({
          id,
          pageSize,
          pageIndex
        });
      }
    });
  }
}
