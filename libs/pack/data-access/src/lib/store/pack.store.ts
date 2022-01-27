import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  Pack,
  PackContent,
  PackContentListingRequest,
  PackCore,
  PackDeleteRequest,
  PackListingRequest,
  PackPublishToggleRequest
} from '../models/pack.interface';
import { EMPTY, Observable } from 'rxjs';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { PackService } from '../services/pack.service';
import { Router } from '@angular/router';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { MatDialog } from '@angular/material/dialog';
import { GenericDialogPrompt } from '@hidden-innovation/shared/models';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';

export interface PackState {
  packs: Pack[];
  packContents?: PackContent[];
  selectedPack?: Pack;
  total: number;
  isLoading?: boolean;
  isContentLoading?: boolean;
  isActing?: boolean;
  loaded?: boolean;
};

const initialState: PackState = {
  packs: [],
  packContents: [],
  total: 0,
  isLoading: false,
  isActing: false,
  loaded: false
};

@Injectable()
export class PackStore extends ComponentStore<PackState> {

  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);
  readonly isContentLoading$: Observable<boolean> = this.select(state => !!state.isContentLoading);
  readonly loaded$: Observable<boolean> = this.select(state => !!state.loaded);
  readonly isActing$: Observable<boolean> = this.select(state => !!state.isActing);
  readonly count$: Observable<number> = this.select(state => state.total || 0);
  readonly packs$: Observable<Pack[]> = this.select(state => state.packs || []);
  readonly packContents$: Observable<PackContent[]> = this.select(state => state.packContents || []);
  readonly selectedPack$: Observable<Pack | undefined> = this.select(state => state.selectedPack);

  getPacks$ = this.effect<PackListingRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isLoading: true,
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

  getPackContent$ = this.effect<PackContentListingRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isContentLoading: true
        });
      }),
      switchMap((reqObj) =>
        this.packService.getContentPack(reqObj).pipe(
          tapResponse(
            ({ allPack, count }) => {
              this.patchState({
                isContentLoading: false,
                packContents: allPack,
                total: count
              });
            },
            _ => {
              this.patchState({
                isContentLoading: false
              });
            }
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );
  private toastRef: CreateHotToastRef<unknown> | undefined;
  updatePack$ = this.effect<{ pack: PackCore, id: number }>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Updating Pack...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap(({ pack, id }) =>
        this.packService.updatePackDetails(id, pack).pipe(
          tapResponse(
            (selectedPack) => {
              this.patchState({
                isActing: false,
                loaded: true,
                selectedPack
              });
              this.toastRef?.updateMessage('Pack Updated!');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success',
                duration: 300
              });
              this.router.navigate(['/packs']);
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
  getPackDetails$ = this.effect<{ id: number }>(params$ =>
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
        this.packService.getPackDetails(id).pipe(
          tapResponse(
            (selectedPack) => {
              this.patchState({
                isLoading: false,
                selectedPack
              });
              this.toastRef?.close();
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

  private togglePublishState$ = this.effect<PackPublishToggleRequest>(params$ =>
    params$.pipe(
      tap((state) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading(state.newState ? 'Publishing Test...' : 'Un-publishing Test...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap(({ id, newState }) =>
        this.packService.togglePackPublishStatus(id).pipe(
          tapResponse(
            _ => {
              const packs: Pack[] | undefined = this.get().packs;
              this.patchState({
                isActing: false,
                loaded: true,
                packs: packs.map(p => {
                  if (p.id === id) {
                    return {
                      ...p,
                      isPublished: newState
                    };
                  } else {
                    return p;
                  }
                })
              });
              this.toastRef?.updateMessage(newState ? 'Success! Pack Published' : 'Success! Pack Un-published');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success'
              });
            },
            _ => {
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

  private deletePack$ = this.effect<PackDeleteRequest>(params$ =>
    params$.pipe(
      tap((_) => {
        this.patchState({
          isActing: true
        });
        this.toastRef?.close();
        this.toastRef = this.hotToastService.loading('Deleting Pack...', {
          dismissible: false,
          role: 'status'
        });
      }),
      exhaustMap(({ id, pageSize, pageIndex, nameSort, dateSort, search, published }) =>
        this.packService.deletePack(id).pipe(
          tapResponse(
            _ => {
              const packs: Pack[] = this.get().packs;
              this.patchState({
                isActing: false,
                loaded: true,
                packs: packs.filter(p => p.id !== id)
              });
              this.toastRef?.updateMessage('Success! Pack deleted');
              this.toastRef?.updateToast({
                dismissible: true,
                type: 'success'
              });
              this.getPacks$({
                page: pageIndex,
                limit: pageSize,
                nameSort,
                dateSort,
                search,
                published
              });
            },
            _ => {
              this.toastRef?.close();
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

  toggleActive(id: number, currentState: boolean): void {
    const newState = !currentState;
    const dialogData: GenericDialogPrompt = {
      title: newState ? 'Publish Pack?' : 'Un-publish Pack?',
      desc: newState ? `Are you sure you want to publish this Pack?` : 'This might impact various other modules .i.e. Featured Screen etc.',
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
        this.togglePublishState$({
          id,
          newState
        });
      }
    });
  }

  deletePack(deleteObj: PackDeleteRequest): void {
    const dialogData: GenericDialogPrompt = {
      title: 'Delete Pack?',
      desc: `This might impact various other modules .i.e. Featured Screen etc.`,
      action: {
        posTitle: 'Yes',
        negTitle: 'No',
        type: 'mat-warn'
      }
    };
    const dialogRef = this.matDialog.open(PromptDialogComponent, {
      data: dialogData,
      minWidth: '25rem'
    });
    dialogRef.afterClosed().subscribe((proceed: boolean) => {
      if (proceed) {
        this.deletePack$(deleteObj);
      }
    });
  }
}
