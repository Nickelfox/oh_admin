import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { PublishStatusEnum, SortingEnum, StatusChipType } from '@hidden-innovation/shared/models';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Pack, PackListingFilters, PackStore } from '@hidden-innovation/pack/data-access';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UiStore } from '@hidden-innovation/shared/store';
import { HotToastService } from '@ngneat/hot-toast';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { isEqual } from 'lodash-es';
import { MatSelectionListChange } from '@angular/material/list';
import { ContentSelectionService } from '@hidden-innovation/shared/utils';
import { Test } from '@hidden-innovation/test/data-access';

export interface PackSelectorData {
  limit?: boolean;
}

@Component({
  selector: 'hidden-innovation-pack-selector',
  templateUrl: './pack-selector.component.html',
  styleUrls: ['./pack-selector.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackSelectorComponent implements OnInit {
  displayedColumns: string[] = ['select', 'id', 'name', 'updated_at', 'lessons', 'content', 'status'];
  packs: MatTableDataSource<Pack> = new MatTableDataSource<Pack>();

  noData?: Observable<boolean>;

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

  selectedPacks: Pack[] = [];
  dummyPacks: Pack[] = [];

  initialised = false;
  isLoading = false;

  constructor(
    public matDialogRef: MatDialogRef<Pack[]>,
    public constantDataService: ConstantDataService,
    public store: PackStore,
    @Inject(MAT_DIALOG_DATA) public data: PackSelectorData,
    private cdr: ChangeDetectorRef,
    public uiStore: UiStore,
    private hotToastService: HotToastService,
    private contentSelectionService: ContentSelectionService
  ) {
    if (this.data === undefined || this.data === null) {
      this.hotToastService.error('Application Error! Data needs to to sent before selecting any tests');
      this.matDialogRef.close();
      return;
    }
    this.noData = this.packs.connect().pipe(map(data => data.length === 0));
    this.uiStore.selectedPacks$.subscribe((res) => {
      this.selectedPacks = res;
      this.dummyPacks = res;
    });
    if (!this.initialised) {
      this.uiStore.patchState({
        selectedPacks: this.selectedPacks
      });
      this.initialised = true;
      this.cdr.markForCheck();
    }
    this.refreshList();
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  get Count() {
    if (this.selectedPacks.length === 0) {
      return '';
    }
    return this.selectedPacks ? `SELECTED ITEMS ${this.selectedPacks.length}` : '-';
  }

  get isAllSelected(): boolean {
    const numSelected: number[] = this.selectedPacks?.map(p => p.id) ?? [];
    return this.contentSelectionService.isContentEqual(this.packs.data.map(p => p.id), numSelected);
  }

  get someSelected(): boolean {
    try {
      if (this.selectedPacks?.length <= 0) {
        return false;
      }
      const currentSelectedItems: Pack[] = this.packs.data.filter(t1 => this.selectedPacks.findIndex(t2 => t1.id === t2.id) !== -1);
      return currentSelectedItems.length !== this.packs.data.length;
    } catch {
      return false;
    }
  }

  resetPagination(): void {
    this.pageIndex = this.constantDataService.PaginatorData.pageIndex;
    this.pageSize = this.constantDataService.PaginatorData.pageSize;
    this.refreshList();
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

  ngOnInit(): void {
    this.store.packs$.subscribe(
      (packs) => {
        this.packs = new MatTableDataSource<Pack>(packs);
        this.noData = this.packs.connect().pipe(map(data => data.length === 0));
        if (!packs?.length && (this.pageIndex > this.constantDataService.PaginatorData.pageIndex)) {
          this.resetPagination();
        }
        this.cdr.markForCheck();
      }
    );
    this.store.isLoading$.subscribe(loading => this.isLoading = loading);
    this.filters.valueChanges.pipe(
      distinctUntilChanged((x, y) => isEqual(x, y)),
      tap(_ => this.refreshList())
    ).subscribe();
  }

  isSelected(pack: Pack): boolean {
    return !!this.selectedPacks.find(value => value.id === pack.id);
  }

  masterToggleStackError(): void {
    this.hotToastService.error('Application Error! Select All module stack issue');
  }

  masterToggle(): void {
    if (this.isAllSelected) {
      try {
        const clearedPacks: Pack[] = this.selectedPacks.filter(p => !this.packs.data.find(p2 => p2.id === p.id));
        this.uiStore.patchState({
          selectedPacks: clearedPacks
        });
      } catch {
        this.masterToggleStackError();
      }
    } else {
      try {
        const leftOutPacks: Pack[] = this.packs.data.filter(p1 => this.selectedPacks.findIndex(p2 => p2.id === p1.id) === -1);
        this.uiStore.patchState({
          selectedPacks: [
            ...this.selectedPacks,
            ...leftOutPacks
          ]
        });
      } catch {
        this.masterToggleStackError();
      }
    }
  }

  addToList(pack: Pack): void {
    let selectedPacks: Pack[] = [];
    if (this.selectedPacks.find(value => value.id === pack.id)) {
      selectedPacks = [
        ...this.selectedPacks.filter(t => t.id !== pack.id)
      ];
    } else {
      if (this.data?.limit) {
        selectedPacks = [pack];
      } else {
        selectedPacks = [
          ...this.selectedPacks,
          pack
        ];
      }
    }
    this.uiStore.patchState({
      selectedPacks
    });
  }

  onPaginateChange($event: PageEvent): void {
    this.pageIndex = $event.pageIndex + 1;
    this.pageSize = $event.pageSize;
    this.refreshList();
  }

  trackById(index: number, p: Pack): number {
    return p.id;
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


}
