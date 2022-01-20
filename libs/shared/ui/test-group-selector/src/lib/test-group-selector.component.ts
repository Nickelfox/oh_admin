import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { SelectionModel } from '@angular/cdk/collections';
import {
  TestGroup,
  TestGroupCore,
  TestGroupListingFilters,
  TestGroupStore
} from '@hidden-innovation/test-group/data-access';
import {
  ContentSelectorOpType,
  DifficultyEnum,
  PackContentTypeEnum,
  PublishStatusEnum,
  SortingEnum,
  StatusChipType,
  TagCategoryEnum
} from '@hidden-innovation/shared/models';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { isEqual } from 'lodash-es';
import { UiStore } from '@hidden-innovation/shared/store';
import { MatSelectionListChange } from '@angular/material/list';
import { UntilDestroy } from '@ngneat/until-destroy';
import { HotToastService } from '@ngneat/hot-toast';
import { ContentCore, LessonCore } from '@hidden-innovation/pack/data-access';

export interface TestGroupSelectorData {
  type: ContentSelectorOpType;
  limit?: boolean;
}

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-test-group-selector',
  templateUrl: './test-group-selector.component.html',
  styleUrls: ['./test-group-selector.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestGroupSelectorComponent implements OnInit {

  displayedColumns: string[] = ['select', 'id', 'name', 'updated_at', 'category', 'options', 'status'];

  testGroup: MatTableDataSource<TestGroup> = new MatTableDataSource<TestGroup>([]);
  noData?: Observable<boolean>;

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
    published: new FormControl(undefined)
  });


  selectedTestGroups: TestGroup[] = [];
  dummyTestGroups: TestGroup[] = [];
  selectedContents: (ContentCore | LessonCore)[] = [];
  dummyContents: (ContentCore | LessonCore)[] = [];

  initialised = false;
  isLoading = false;

  constructor(
    public constantDataService: ConstantDataService,
    public matDialogRef: MatDialogRef<TestGroup[]>,
    @Inject(MAT_DIALOG_DATA) public data: TestGroupSelectorData,
    public store: TestGroupStore,
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public uiStore: UiStore,
    private hotToastService: HotToastService
  ) {
    if (!this.data) {
      this.hotToastService.error('Application Error! Type data needs to to sent before selecting any test group');
      this.matDialogRef.close();
      return;
    }
    this.noData = this.testGroup.connect().pipe(map(data => data.length === 0));
    this.uiStore.state$.subscribe(res => {
      const { selectedTestGroups } = res;
      switch (this.data.type) {
        case ContentSelectorOpType.SINGLE:
          this.selectedTestGroups = selectedTestGroups ?? [];
          this.dummyTestGroups = selectedTestGroups ?? [];
          break;
        case ContentSelectorOpType.OTHER:
          this.selectedContents = res.selectedContent ?? [];
          this.dummyContents = res.selectedContent ?? [];
          break;
      }
    });
    if (!this.initialised) {
      switch (this.data.type) {
        case ContentSelectorOpType.SINGLE:
          this.uiStore.patchState({
            selectedTestGroups: this.selectedTestGroups
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
    this.store.isLoading$.subscribe(loading => this.isLoading = loading);
    this.filters.valueChanges.pipe(
      distinctUntilChanged((x, y) => isEqual(x, y)),
      tap(_ => this.refreshList())
    ).subscribe();
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
    switch (this.data.type) {
      case ContentSelectorOpType.SINGLE:
        return !!this.selectedTestGroups.find(value => value.id === tg.id);
      case ContentSelectorOpType.OTHER:
        return !!this.selectedContents.find(value => (value.contentId === tg.id) && (value.type === PackContentTypeEnum.GROUP));
    }
  }

  addToList(tg: TestGroup): void {
    let selectedContent: (ContentCore | LessonCore)[] = [];
    let selectedTestGroups: TestGroup[] = [];
    let selectedItem: ContentCore;
    switch (this.data.type) {
      case ContentSelectorOpType.SINGLE:
        if (!this.selectedTestGroups.find(value => value.id === tg.id)) {
          if (this.data?.limit) {
            selectedTestGroups = [tg];
          } else {
            selectedTestGroups = [
              ...this.selectedTestGroups,
              tg
            ];
          }
        } else {
          selectedTestGroups = [
            ...this.selectedTestGroups.filter(t => t.id !== tg.id)
          ];
        }
        this.uiStore.patchState({
          selectedTestGroups
        });
        break;
      case ContentSelectorOpType.OTHER:
        selectedItem = this.selectedContents.find(value => (value.contentId === tg.id) && (value.type === PackContentTypeEnum.GROUP)) as ContentCore;
        if (selectedItem) {
          selectedContent = [...this.selectedContents.filter(value => !isEqual(value, selectedItem))];
        } else {
          if (this.data?.limit) {
            selectedContent = [
              {
                contentId: tg.id,
                type: PackContentTypeEnum.GROUP,
                name: tg.name
              } as ContentCore
            ];
          } else {
            selectedContent = [
              ...this.selectedContents,
              {
                contentId: tg.id,
                type: PackContentTypeEnum.GROUP,
                name: tg.name
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

  onPaginateChange($event: PageEvent): void {
    this.pageIndex = $event.pageIndex + 1;
    this.pageSize = $event.pageSize;
    this.refreshList();
  }

  // closeDialog(): void {
  //   const isDifferent = differenceBy(this.selectedTestGroups, [...this.dummyTestGroups], 'id');
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
  //         this.saveSelectedTestgroups();
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
