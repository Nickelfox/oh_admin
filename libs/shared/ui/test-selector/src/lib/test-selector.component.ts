import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Test, TestListingFilters, TestStore } from '@hidden-innovation/test/data-access';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import {
  ContentSelectorOpType,
  DifficultyEnum,
  PackContentTypeEnum,
  PublishStatusEnum,
  SortingEnum,
  StatusChipType,
  TagCategoryEnum,
  TestInputTypeEnum
} from '@hidden-innovation/shared/models';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { MatSelectionListChange } from '@angular/material/list';
import { isEqual } from 'lodash-es';
import { UntilDestroy } from '@ngneat/until-destroy';
import { UiStore } from '@hidden-innovation/shared/store';
import { HotToastService } from '@ngneat/hot-toast';
import { ContentCore, LessonCore } from '@hidden-innovation/pack/data-access';
import { ContentSelectionService } from '@hidden-innovation/shared/utils';

export interface TestSelectorData {
  type: ContentSelectorOpType;
  limit?: boolean;
  category?: TagCategoryEnum | 'NONE';
}

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

  noData?: Observable<boolean>;

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  statusChipType = StatusChipType;
  publishStatusEnum = PublishStatusEnum;
  sortingEnum = SortingEnum;
  contentSelectorOpType = ContentSelectorOpType;
  testInputTypeEnum = TestInputTypeEnum;

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
  dummyTests: Test[] = [];

  selectedContents: (ContentCore | LessonCore)[] = [];
  dummyContents: (ContentCore | LessonCore)[] = [];

  initialised = false;
  isLoading = false;
  count?: number;

  constructor(
    public matDialogRef: MatDialogRef<Test[]>,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public categoryData: TestSelectorData,
    public constantDataService: ConstantDataService,
    public store: TestStore,
    private cdr: ChangeDetectorRef,
    public uiStore: UiStore,
    private hotToastService: HotToastService,
    private contentSelectionService: ContentSelectionService
  ) {
    if (this.categoryData === undefined || this.categoryData === null) {
      this.hotToastService.error('Application Error! Category data needs to to sent before selecting any tests');
      this.matDialogRef.close();
      return;
    }
    this.noData = this.tests.connect().pipe(map(data => data.length === 0));
    this.uiStore.state$.subscribe((res) => {
      switch (this.categoryData.type) {
        case ContentSelectorOpType.SINGLE:
          this.selectedTests = res.selectedTests ?? [];
          this.dummyTests = res.selectedTests ?? [];
          break;
        case ContentSelectorOpType.OTHER:
          this.selectedContents = res.selectedContent ?? [];
          this.dummyContents = res.selectedContent ?? [];
          break;
      }
    });
    if (!this.initialised) {
      switch (this.categoryData.type) {
        case ContentSelectorOpType.SINGLE:
          this.uiStore.patchState({
            selectedTests: this.selectedTests
          });
          break;
        case ContentSelectorOpType.OTHER:
          this.uiStore.patchState({
            selectedContent: this.selectedContents
          });
          break;
      }
      this.initialised = true;
      this.cdr.markForCheck();
    }
    this.refreshList();
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  get Count() {
    let length: number;
    switch (this.categoryData.type) {
      case ContentSelectorOpType.SINGLE:
        length = this.selectedTests?.length ?? 0;
        if (length <= 0) {
          return '';
        }
        return this.selectedTests ? `SELECTED ITEMS ${length}` : '-';
      case ContentSelectorOpType.OTHER:
        length = this.selectedContents?.filter(value => value.type === PackContentTypeEnum.SINGLE)?.length ?? 0;
        if (length <= 0) {
          return '';
        }
        return this.selectedContents ? `SELECTED ITEMS ${length}` : '-';
    }
  }

  get isAllSelected(): boolean {
    let numSelected: number[] = [];
    if (this.categoryData.type === ContentSelectorOpType.SINGLE) {
      numSelected = this.selectedTests.map(t => t.id);
    } else if (this.categoryData.type === ContentSelectorOpType.OTHER) {
      numSelected = this.selectedContents.filter(c => c.type === PackContentTypeEnum.SINGLE).map(t => t.contentId as number);
    }
    return this.contentSelectionService.isContentEqual(this.tests.data.map(t => t.id), numSelected);
  }

  get someSelected(): boolean {
    if (this.categoryData.type === ContentSelectorOpType.SINGLE) {
      try {
        if (this.selectedTests?.length <= 0) return false;
        const currentSelectedItems: Test[] = this.tests.data.filter(t1 => this.selectedTests.findIndex(t2 => t1.id === t2.id) !== -1);
        if (currentSelectedItems?.length <= 0) return false;
        return currentSelectedItems.length !== this.tests.data.length;
      } catch {
        return false;
      }
    } else if (this.categoryData.type === ContentSelectorOpType.OTHER) {
      try {
        const selectedTests: ContentCore[] = this.selectedContents?.filter(t => t.type === PackContentTypeEnum.SINGLE);
        const currentSelectedItems: Test[] = this.tests.data.filter(t1 => selectedTests.findIndex(t2 => t1.id === t2.contentId) !== -1);
        if (currentSelectedItems?.length <= 0) return false;
        return currentSelectedItems.length !== this.tests.data.length;
      } catch {
        return false;
      }
    }
    return false;
  }

  resetPagination(): void {
    this.pageIndex = this.constantDataService.PaginatorData.pageIndex;
    this.pageSize = this.constantDataService.PaginatorData.pageSize;
    this.refreshList();
  }

  refreshList(): void {
    const { type, nameSort, dateSort, search, published, level, category } = this.filters.value;
    const categoryData: (TagCategoryEnum | 'NONE')[] | undefined = this.categoryData.category ? [this.categoryData.category] : category;
    this.store.getTests$({
      page: this.pageIndex,
      limit: this.pageSize,
      type,
      category: categoryData ?? [],
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
    this.store.isLoading$.subscribe(loading => this.isLoading = loading);
    this.filters.valueChanges.pipe(
      distinctUntilChanged((x, y) => isEqual(x, y)),
      tap(_ => this.refreshList())
    ).subscribe();
  }

  onPaginateChange($event: PageEvent): void {
    this.pageIndex = $event.pageIndex + 1;
    this.pageSize = $event.pageSize;
    this.refreshList();
  }

  masterToggleStackError(): void {
    this.hotToastService.error('Application Error! Select All module stack issue');
  }

  masterToggle(): void {
    if (this.isAllSelected) {
      if (this.categoryData.type === ContentSelectorOpType.SINGLE) {
        try {
          const clearedTests: Test[] = this.selectedTests.filter(t => !this.tests.data.find(t2 => t2.id === t.id));
          this.uiStore.patchState({
            selectedTests: clearedTests
          });
        } catch {
          this.masterToggleStackError();
        }
      } else if (this.categoryData.type === ContentSelectorOpType.OTHER) {
        try {
          const clearedTests: (ContentCore | LessonCore)[] = this.selectedContents.filter(t => !this.tests.data.find(test => (t.contentId === test.id && t.type === PackContentTypeEnum.SINGLE)));
          this.uiStore.patchState({
            selectedContent: clearedTests
          });
        } catch {
          this.masterToggleStackError();
        }
      }
    } else {
      if (this.categoryData.type === ContentSelectorOpType.SINGLE) {
        try {
          const leftOutTests: Test[] = this.tests.data.filter(t1 => this.selectedTests.findIndex(t2 => t2.id === t1.id) === -1);
          this.uiStore.patchState({
            selectedTests: [
              ...this.selectedTests,
              ...leftOutTests
            ]
          });
        } catch {
          this.masterToggleStackError();
        }
      } else if (this.categoryData.type === ContentSelectorOpType.OTHER) {
        try {
          let clearedTests: ContentCore[] = [];
          if (this.tests.data.filter((t) => this.selectedContents.findIndex(c => t.id === c.contentId && c.type === PackContentTypeEnum.SINGLE) !== -1).length) {
            clearedTests = this.tests.data
              .filter((t) => !this.selectedContents.find(({contentId, type}) => t.id === contentId && type === PackContentTypeEnum.SINGLE))
              .map(t => {
              return {
                contentId: t.id,
                type: PackContentTypeEnum.SINGLE,
                name: t.name
              } as ContentCore;
            });
          } else {
            clearedTests = this.tests.data.map(t => {
              return {
                contentId: t.id,
                type: PackContentTypeEnum.SINGLE,
                name: t.name
              } as ContentCore;
            });
          }
          this.uiStore.patchState({
            selectedContent: [
              ...this.selectedContents,
              ...clearedTests
            ]
          });
        } catch {
          this.masterToggleStackError();
        }
      }
    }
  }

  trackById(index: number, test: Test): number {
    return test.id;
  }

  isSelected(test: Test): boolean {
    switch (this.categoryData.type) {
      case ContentSelectorOpType.SINGLE:
        return !!this.selectedTests.find(value => value.id === test.id);
      case ContentSelectorOpType.OTHER:
        return !!this.selectedContents.find(value => (value.contentId === test.id) && (value.type === PackContentTypeEnum.SINGLE));
    }
  }

  addToList(test: Test): void {
    let selectedContent: (ContentCore | LessonCore)[] = [];
    let selectedTests: Test[] = [];
    let selectedItem: ContentCore;
    switch (this.categoryData.type) {
      case ContentSelectorOpType.SINGLE:
        if (this.selectedTests.find(value => value.id === test.id)) {
          selectedTests = [
            ...this.selectedTests.filter(t => t.id !== test.id)
          ];
        } else {
          if (this.categoryData?.limit) {
            selectedTests = [test];
          } else {
            selectedTests = [
              ...this.selectedTests,
              test
            ];
          }
        }
        this.uiStore.patchState({
          selectedTests
        });
        break;
      case ContentSelectorOpType.OTHER:
        selectedItem = this.selectedContents.find(value => (value.contentId === test.id) && (value.type === PackContentTypeEnum.SINGLE)) as ContentCore;
        if (selectedItem) {
          selectedContent = [...this.selectedContents.filter(value => !isEqual(value, selectedItem))];
        } else {
          if (this.categoryData?.limit) {
            selectedContent = [
              {
                contentId: test.id,
                type: PackContentTypeEnum.SINGLE,
                name: test.name
              } as ContentCore
            ];
          } else {
            selectedContent = [
              ...this.selectedContents,
              {
                contentId: test.id,
                type: PackContentTypeEnum.SINGLE,
                name: test.name
              } as ContentCore
            ];
          }
        }
        this.uiStore.patchState({
          selectedContent
        });
        break;
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

  // closeDialog(): void {
  //   const isDifferent = differenceBy(this.selectedTests, [...this.dummyTests], 'id');
  //   if (isDifferent.length) {
  //     const dialogData: GenericDialogPrompt = {
  //       title: 'Review Changes',
  //       desc: `You have made changes. Do you want to save them?`,
  //       action: {
  //         posTitle: 'Save',
  //         negTitle: 'Discard',
  //         type: 'mat-primary'
  //       }
  //     };
  //     const dialogRef = this.matDialog.open(PromptDialogComponent, {
  //       data: dialogData,
  //       minWidth: '25rem'
  //     });
  //     dialogRef.afterClosed().subscribe((proceed: boolean) => {
  //       if (proceed === true) {
  //         this.saveSelectedTests();
  //       } else if (proceed === false) {
  //         this.matDialogRef.close();
  //       } else {
  //         dialogRef.close();
  //       }
  //     });
  //   } else {
  //     this.matDialogRef.close();
  //   }
  // }
}
