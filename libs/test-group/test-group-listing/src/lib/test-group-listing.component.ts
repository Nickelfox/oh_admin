import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import {
  DifficultyEnum,
  PublishStatusEnum,
  SortingEnum,
  StatusChipType,
  TagCategoryEnum
} from '@hidden-innovation/shared/models';
import { MatTableDataSource } from '@angular/material/table';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { TestGroup, TestGroupListingFilters, TestGroupStore } from '@hidden-innovation/test-group/data-access';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash-es';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'hidden-innovation-test-group-listing',
  templateUrl: './test-group-listing.component.html',
  styleUrls: ['./test-group-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestGroupListingComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'updated_at', 'category', 'options', 'status', 'action'];

  testGroup: MatTableDataSource<TestGroup> = new MatTableDataSource<TestGroup>([]);
  noData: Observable<boolean>;

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

  listingRoute = '/tests-group/listing/';

  constructor(
    public constantDataService: ConstantDataService,
    public store: TestGroupStore,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.noData = this.testGroup.connect().pipe(map(data => data.length === 0));
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

  trackById(index: number, tg: TestGroup): number {
    return tg.id;
  }


  ngOnInit(): void {
    this.store.testGroups$.subscribe(
      (tgs) => {
        this.testGroup = new MatTableDataSource<TestGroup>(tgs);
        this.noData = this.testGroup.connect().pipe(map(data => data.length === 0));
        if (!tgs?.length && (this.pageIndex > this.constantDataService.PaginatorData.pageIndex)) {
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
