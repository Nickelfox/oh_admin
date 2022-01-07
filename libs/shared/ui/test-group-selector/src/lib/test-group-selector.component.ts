import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { SelectionModel } from '@angular/cdk/collections';
import {
  TestGroup,
  TestGroupCore,
  TestGroupListingFilters,
  TestGroupStore
} from '@hidden-innovation/test-group/data-access';
import {
  DifficultyEnum,
  GenericDialogPrompt,
  PublishStatusEnum,
  SortingEnum,
  StatusChipType,
  TagCategoryEnum
} from '@hidden-innovation/shared/models';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { differenceBy, isEqual } from 'lodash-es';
import { UiStore } from '@hidden-innovation/shared/store';
import { MatSelectionListChange } from '@angular/material/list';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';

@Component({
  selector: 'hidden-innovation-test-group-selector',
  templateUrl: './test-group-selector.component.html',
  styleUrls: ['./test-group-selector.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestGroupSelectorComponent implements OnInit {

  displayedColumns: string[] = ['select', 'id', 'name', 'updated_at', 'category', 'options'];

  testGroup: MatTableDataSource<TestGroup> = new MatTableDataSource<TestGroup>([]);
  noData: Observable<boolean>;

  selection = new SelectionModel<TestGroupCore>(true, []);

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  publishStatusEnum = PublishStatusEnum;
  statusChipType = StatusChipType;
  sortingEnum = SortingEnum;

  difficultyIte = Object.values(DifficultyEnum);
  tagCategoryIte = Object.values(TagCategoryEnum);

  filters: FormGroup<TestGroupListingFilters> = new FormGroup<TestGroupListingFilters>({
    category: new FormControl(undefined),
    dateSort: new FormControl(SortingEnum.DESC),
    nameSort: new FormControl({ value: undefined, disabled: true }),
    search: new FormControl(undefined),
    published: new FormControl('TRUE')
  });


  selectedTestGroups: TestGroup[] = [];
  dummyTests: TestGroup[] = [];

  initialised = false;

  constructor(
    public constantDataService: ConstantDataService,
    public matDialogRef: MatDialogRef<TestGroup[]>,
    public store: TestGroupStore,
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public uiStore: UiStore
  ) {
    this.noData = this.testGroup.connect().pipe(map(data => data.length === 0));
    this.uiStore.selectedTestGroups$.subscribe(tgs => {
      this.selectedTestGroups = tgs;
      this.dummyTests = tgs;
    });
    if (!this.initialised) {
      this.uiStore.patchState({
        selectedTestGroups: this.selectedTestGroups
      });
      this.initialised = true;
    }
    this.refreshList();
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  resetPagination(): void {
    this.pageIndex = this.constantDataService.PaginatorData.pageIndex;
    this.pageSize = this.constantDataService.PaginatorData.pageSize;
  }

  ngOnInit(): void {
    this.store.testGroups$.subscribe(
      (tgs) => {
        this.testGroup = new MatTableDataSource<TestGroup>(tgs);
        this.noData = this.testGroup.connect().pipe(map(data => data.length === 0));
        if (!tgs?.length && (this.pageIndex > this.constantDataService.PaginatorData.pageIndex)) {
          this.resetPagination();
        }
        this.cdr.markForCheck();
      }
    );
    this.filters.valueChanges.pipe(
      distinctUntilChanged((x, y) => isEqual(x, y)),
      tap(_ => this.refreshList())
    ).subscribe();
    this.updateSorting('nameSort');
    this.updateSorting('nameSort');
  }


  trackById(index: number, tg: TestGroup): number {
    return tg.id;
  }


  refreshList(): void {
    const { category, nameSort, dateSort, search, published } = this.filters.value;
    this.store.getTestGroups$({
      page: this.pageIndex,
      limit: this.pageSize,
      category,
      dateSort,
      search,
      published,
      nameSort
    });
  }

  isSelected(tg: TestGroup): boolean {
    return !!this.selectedTestGroups.find(value => value.id === tg.id);
  }

  addToList(tg: TestGroup): void {
    if (!this.selectedTestGroups.find(value => value.id === tg.id)) {
      this.selectedTestGroups = [
        ...this.selectedTestGroups,
        tg
      ];
    } else {
      this.selectedTestGroups = [
        ...this.selectedTestGroups.filter(t => t.id !== tg.id)
      ];
    }
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

  categoryFilterChange(matSelection: MatSelectionListChange): void {
    const { _value } = matSelection.source;
    const { category } = this.filters.controls;
    if (_value?.length) {
      category.setValue(_value);
      category.enable();
    } else {
      category.setValue(undefined);
      category.disable();
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

  saveSelectedTestgroups(): void {
    this.uiStore.patchState({
      selectedTestGroups: [
        ...this.selectedTestGroups
      ]
    });
    this.matDialogRef.close(this.selectedTestGroups);
  }

  onPaginateChange($event: PageEvent): void {
    this.pageIndex = $event.pageIndex + 1;
    this.pageSize = $event.pageSize;
    this.refreshList();
  }

  closeDialog(): void {
    const isDifferent = differenceBy(this.selectedTestGroups, [...this.dummyTests], 'id');
    if (isDifferent.length) {
      const dialogData: GenericDialogPrompt = {
        title: 'Review Changes',
        desc: `You have made changes. Do you want to save them?`,
        action: {
          posTitle: 'Save',
          negTitle: 'Discard',
          type: 'mat-primary'
        }
      };
      const dialogRef = this.matDialog.open(PromptDialogComponent, {
        data: dialogData,
        minWidth: '25rem'
      });
      dialogRef.afterClosed().subscribe((proceed: boolean) => {
        if (proceed === true) {
          this.saveSelectedTestgroups();
        } else if (proceed === false) {
          this.matDialogRef.close();
        } else {
          dialogRef.close();
        }
      });
    } else {
      this.matDialogRef.close();
    }
  }

}
