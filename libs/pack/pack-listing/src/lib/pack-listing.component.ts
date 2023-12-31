import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  Content,
  Lesson,
  Pack,
  PackDeleteRequest,
  PackListingFilters,
  PackStore
} from '@hidden-innovation/pack/data-access';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import {
  GenericDialogPrompt,
  PackContentTypeEnum,
  PublishStatusEnum,
  SortingEnum,
  StatusChipType
} from '@hidden-innovation/shared/models';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash-es';
import { MatSelectionListChange } from '@angular/material/list';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'hidden-innovation-pack-listing',
  templateUrl: './pack-listing.component.html',
  styleUrls: ['./pack-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackListingComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'updated_at', 'lessons', 'content', 'status', 'action'];
  packs: MatTableDataSource<Pack> = new MatTableDataSource<Pack>();

  noData: Observable<boolean>;

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  statusChipType = StatusChipType;
  publishStatusEnum = PublishStatusEnum;
  sortingEnum = SortingEnum;

  filters: FormGroup<PackListingFilters> = new FormGroup<PackListingFilters>({
    dateSort: new FormControl(SortingEnum.DESC),
    nameSort: new FormControl({ value: undefined, disabled: true }),
    search: new FormControl(undefined),
    published: new FormControl(undefined)
  });

  listingRoute = '/packs/listing/';

  constructor(
    public constantDataService: ConstantDataService,
    public store: PackStore,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.noData = this.packs.connect().pipe(map(data => data.length === 0));
    this.route.params.subscribe((params) => {
      this.pageIndex = params['index'];
      this.pageSize = params['size'];
      this.refreshList();
    });
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  resetRoute(): void {
    this.router.navigate([
      this.listingRoute, this.constantDataService.PaginatorData.pageSize, this.constantDataService.PaginatorData.pageIndex
    ], {
      relativeTo: this.route
    });
  }

  refreshList(): void {
    const { nameSort, dateSort, search, published } = this.filters.value;
    this.store.getPacks$({
      page: this.pageIndex,
      limit: this.pageSize,
      dateSort,
      search,
      published,
      nameSort
    });
  }

  getLessonsCount(pack: Pack): number {
    if (pack && pack.content) {
      try {
        const contents: (Content | Lesson)[] = pack?.content ?? [];
        return contents.filter(c => c.type === PackContentTypeEnum.LESSON).length;
      } catch {
        return 0;
      }
    } else {
      return 0;
    }
  }

  trackById(index: number, p: Pack): number {
    return p.id;
  }

  ngOnInit(): void {
    this.store.packs$.subscribe(
      (packs) => {
        this.packs = new MatTableDataSource<Pack>(packs);
        this.noData = this.packs.connect().pipe(map(data => data.length === 0));
        if (!packs?.length && (this.pageIndex > this.constantDataService.PaginatorData.pageIndex)) {
          this.resetRoute();
        }
        this.cdr.markForCheck();
      }
    );
    this.filters.valueChanges.pipe(
      distinctUntilChanged((x, y) => isEqual(x, y)),
      tap(_ => this.refreshList())
    ).subscribe();
  }

  onPaginateChange($event: PageEvent): void {
    this.router.navigate([
      this.listingRoute, $event.pageSize, $event.pageIndex + 1
    ], {
      relativeTo: this.route
    });
  }

  updateSorting(fieldName: 'dateSort' | 'nameSort'): void {
    const { nameSort, dateSort } = this.filters.controls;

    const updateSortingCtrl = (ctrl: FormControl) => {
      if (ctrl.disabled) {
        ctrl.setValue(this.sortingEnum.DESC);
        ctrl.enable();
      } else {
        ctrl.value === SortingEnum.DESC ? ctrl.setValue(this.sortingEnum.ASC) : ctrl.setValue(this.sortingEnum.DESC);
      }
      this.cdr.markForCheck();
    };

    switch (fieldName) {
      case 'nameSort':
        dateSort.disable();
        updateSortingCtrl(nameSort);
        break;
      case 'dateSort':
        nameSort.disable();
        updateSortingCtrl(dateSort);
        break;
    }
  }

  updateFilterChange(matSelection: MatSelectionListChange, ctrl: FormControl): void {
    const value = matSelection.source._value as unknown as Array<boolean | undefined>;
    let expandedVal: boolean | undefined;
    try {
      expandedVal = value[0] ?? undefined;
    } catch {
      expandedVal = undefined;
    }
    if (expandedVal !== undefined && expandedVal !== null) {
      ctrl.setValue(expandedVal);
      ctrl.enable();
    } else {
      ctrl.setValue(undefined);
      ctrl.disable();
    }
  }

  deletePack(id: number) {
    const { published, dateSort, nameSort, search } = this.filters.value;
    const deleteObj: PackDeleteRequest = {
      id,
      dateSort,
      nameSort,
      search,
      published,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    };
    this.store.deletePack(deleteObj);
  }

  editPromptForPublished(pack: Pack): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (pack.isPublished) {
      const dialogData: GenericDialogPrompt = {
        title: 'Edit a Published Pack?',
        desc: 'This might impact various other modules .i.e. Featured Screen etc.',
        action: {
          type: 'mat-warn',
          posTitle: 'Confirm',
          negTitle: 'Cancel'
        }
      };
      const dialogRef = this.matDialog.open(PromptDialogComponent, {
        data: dialogData,
        minWidth: '25rem'
      });
      dialogRef.afterClosed().subscribe((proceed: boolean | undefined) => {
        if (proceed) {
          this.router.navigate(['/packs', 'edit', pack.id]);
        }
      });
    } else {
      this.router.navigate(['/packs', 'edit', pack.id]);
    }
  }

}
