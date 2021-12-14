import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { PageEvent } from '@angular/material/paginator';
import {
  DifficultyEnum,
  PublishStatusEnum,
  SortingEnum,
  StatusChipType,
  TagCategoryEnum,
  TestInputTypeEnum
} from '@hidden-innovation/shared/models';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Test, TestListingFilters, TestStore } from '@hidden-innovation/test/data-access';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { isEqual } from 'lodash-es';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MatSelectionListChange } from '@angular/material/list';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-test-listing',
  templateUrl: './test-listing.component.html',
  styleUrls: ['./test-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestListingComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'updated_at', 'category', 'difficulty', 'input', 'status', 'action'];
  tests: MatTableDataSource<Test> = new MatTableDataSource<Test>();

  noData: Observable<boolean>;

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  tagCategoryEnum = TagCategoryEnum;
  statusChipType = StatusChipType;
  publishStatusEnum = PublishStatusEnum;
  testInputTypeEnum = TestInputTypeEnum;
  sortingEnum = SortingEnum;

  tagCategoryIte = Object.values(TagCategoryEnum);
  difficultyIte = Object.values(DifficultyEnum);
  testInputTypeIte = Object.values(TestInputTypeEnum);

  filters: FormGroup<TestListingFilters> = new FormGroup<TestListingFilters>({
    type: new FormControl(undefined),
    category: new FormControl(undefined),
    dateSort: new FormControl(SortingEnum.DESC),
    nameSort: new FormControl({ value: undefined, disabled: true }),
    search: new FormControl(undefined),
    level: new FormControl(undefined),
    published: new FormControl(undefined)
  });

  listingRoute = '/tests/listing/';

  constructor(
    public constantDataService: ConstantDataService,
    public store: TestStore,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.noData = this.tests.connect().pipe(map(data => data.length === 0));
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

  onPaginateChange($event: PageEvent): void {
    this.router.navigate([
      this.listingRoute, $event.pageSize, $event.pageIndex + 1
    ], {
      relativeTo: this.route
    });
  }

  trackById(index: number, test: Test): number {
    return test.id;
  }

  ngOnInit(): void {
    this.store.tests$.subscribe(
      (tests) => {
        this.tests = new MatTableDataSource<Test>(tests);
        this.noData = this.tests.connect().pipe(map(data => data.length === 0));
        this.cdr.markForCheck();
      }
    );
    this.filters.valueChanges.pipe(
      distinctUntilChanged((x, y) => isEqual(x, y)),
      tap(_ => this.refreshList())
    ).subscribe();
    this.filters.controls.search.valueChanges.pipe(
      tap(_ => this.resetRoute())
    ).subscribe();
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
    this.resetRoute();
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
    this.resetRoute();
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
    this.resetRoute();
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
    this.resetRoute();
  }

}
