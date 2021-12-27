import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Test, TestListingFilters, TestStore } from '@hidden-innovation/test/data-access';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import {
  DifficultyEnum,
  GenericDialogPrompt,
  PublishStatusEnum,
  SortingEnum,
  StatusChipType,
  TagCategoryEnum,
  TestInputTypeEnum
} from '@hidden-innovation/shared/models';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { MatSelectionListChange } from '@angular/material/list';
import { differenceBy, isEqual } from 'lodash-es';
import { UntilDestroy } from '@ngneat/until-destroy';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';
import { UiStore } from '@hidden-innovation/shared/store';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-test-selector',
  templateUrl: './test-selector.component.html',
  styleUrls: ['./test-selector.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestSelectorComponent implements OnInit {

  displayedColumns: string[] = ['select', 'id', 'name', 'updated_at', 'category', 'difficulty', 'input', 'status'];
  tests: MatTableDataSource<Test> = new MatTableDataSource<Test>();

  noData: Observable<boolean>;

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  statusChipType = StatusChipType;
  publishStatusEnum = PublishStatusEnum;
  sortingEnum = SortingEnum;

  filters: FormGroup<TestListingFilters> = new FormGroup<TestListingFilters>({
    type: new FormControl(undefined),
    category: new FormControl(undefined),
    dateSort: new FormControl(SortingEnum.DESC),
    nameSort: new FormControl({ value: undefined, disabled: true }),
    search: new FormControl(undefined),
    level: new FormControl(undefined),
    published: new FormControl(undefined)
  });

  tagCategoryIte = Object.values(TagCategoryEnum);
  difficultyIte = Object.values(DifficultyEnum);
  testInputTypeIte = Object.values(TestInputTypeEnum);
  selectedTests: Test[] = [];

  initialised = false;
  dummyTests: Test[] = [];

  constructor(
    public matDialogRef: MatDialogRef<Test[]>,
    private matDialog: MatDialog,
    public constantDataService: ConstantDataService,
    public store: TestStore,
    private cdr: ChangeDetectorRef,
    public uiStore: UiStore
  ) {
    this.noData = this.tests.connect().pipe(map(data => data.length === 0));
    this.uiStore.selectedTests$.subscribe(tests => {
      this.selectedTests = tests;
      this.dummyTests = tests;
    });
    if (!this.initialised) {
      this.uiStore.patchState({
        selectedTests: this.selectedTests
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

  refreshList(): void {
    const { type, category, nameSort, dateSort, search, published, level } = this.filters.value;
    this.store.getTests$({
      page: this.pageIndex,
      limit: this.pageSize,
      type,
      category,
      dateSort,
      search,
      published,
      nameSort,
      level
    });
  }

  ngOnInit(): void {
    this.store.tests$.subscribe(
      (tests) => {
        this.tests = new MatTableDataSource<Test>(tests);
        this.noData = this.tests.connect().pipe(map(data => data.length === 0));
        if (!tests?.length && (this.pageIndex > this.constantDataService.PaginatorData.pageIndex)) {
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

  onPaginateChange($event: PageEvent): void {
    this.pageIndex = $event.pageIndex + 1;
    this.pageSize = $event.pageSize;
    this.refreshList();
  }

  trackById(index: number, test: Test): number {
    return test.id;
  }

  isSelected(test: Test): boolean {
    return !!this.selectedTests.find(value => value.id === test.id);
  }

  addToList(test: Test): void {
    if (!this.selectedTests.find(value => value.id === test.id)) {
      this.selectedTests = [
        ...this.selectedTests,
        test
      ];
    } else {
      this.selectedTests = [
        ...this.selectedTests.filter(t => t.id !== test.id)
      ];
    }
  }

  updateSorting(fieldName: 'type' | 'category' | 'dateSort' | 'nameSort'): void {
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

  difficultyFilterChange(matSelection: MatSelectionListChange): void {
    const { _value } = matSelection.source;
    const { level } = this.filters.controls;
    if (_value?.length) {
      level.setValue(_value);
      level.enable();
    } else {
      level.setValue(undefined);
      level.disable();
    }
  }

  typeFilterChange(matSelection: MatSelectionListChange): void {
    const { _value } = matSelection.source;
    const { type } = this.filters.controls;
    if (_value?.length) {
      type.setValue(_value);
      type.enable();
    } else {
      type.setValue(undefined);
      type.disable();
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

  saveSelectedTests(): void {
    this.uiStore.patchState({
      selectedTests: [
        ...this.selectedTests
      ]
    });
    this.matDialogRef.close(this.selectedTests);
  }

  closeDialog(): void {
    const isDifferent = differenceBy(this.selectedTests, [...this.dummyTests], 'id');
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
          this.saveSelectedTests();
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
