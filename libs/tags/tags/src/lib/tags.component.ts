import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CreateTagRequest,
  Tag,
  TagCore,
  TagDeleteRequest,
  TagDialogReq,
  TagListingFilters,
  TagsStore
} from '@hidden-innovation/tags/data-access';
import { Observable } from 'rxjs';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { SortingEnum, TagCategoryEnum, TagTypeEnum } from '@hidden-innovation/shared/models';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TagCreateComponent } from '@hidden-innovation/shared/ui/tag-create';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { UntilDestroy } from '@ngneat/until-destroy';
import { isEqual } from 'lodash-es';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'type', 'category', 'date_modified', 'action'];
  tags: MatTableDataSource<Tag> = new MatTableDataSource<Tag>();

  noData: Observable<boolean>;

  filters: FormGroup<TagListingFilters> = new FormGroup<TagListingFilters>({
    type: new FormControl(undefined),
    category: new FormControl(undefined),
    dateSort: new FormControl(SortingEnum.DESC),
    nameSort: new FormControl({ value: undefined, disabled: true }),
    search: new FormControl(undefined)
  });

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  categoryEnum = TagCategoryEnum;
  tagType = TagTypeEnum;
  sortingEnum = SortingEnum;

  tagTypeIte = Object.values(TagTypeEnum);
  tagCategoryIte = Object.values(TagCategoryEnum);

  listingRoute = '/tags/listing/';

  @ViewChild('categoryFilter') catFilter: MatSelectionList | undefined;
  @ViewChild('typeFilter') typeFilter: MatSelectionList | undefined;

  constructor(
    public constantDataService: ConstantDataService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    public store: TagsStore,
    private matDialog: MatDialog
  ) {
    this.noData = this.tags.connect().pipe(map(data => data.length === 0));
    this.route.params.subscribe((params) => {
      this.pageIndex = params['index'];
      this.pageSize = params['size'];
      this.refreshList();
    });
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  ngOnInit(): void {
    this.store.state$.subscribe(
      ({ tags }) => {
        this.tags = new MatTableDataSource<Tag>(tags);
        this.noData = this.tags.connect().pipe(map(data => data.length === 0));
        if (!tags?.length && (this.pageIndex > this.constantDataService.PaginatorData.pageIndex)) {
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

  refreshList(): void {
    const { type, category, nameSort, dateSort, search } = this.filters.value;
    this.store.getTags$({
      page: this.pageIndex,
      limit: this.pageSize,
      type,
      category,
      nameSort,
      dateSort,
      search
    });
  }

  resetRoute(): void {
    this.router.navigate([
      this.listingRoute, this.constantDataService.PaginatorData.pageSize, this.constantDataService.PaginatorData.pageIndex
    ], {
      relativeTo: this.route
    });
  }

  onPaginateChange($event: PageEvent): void {
    this.router.navigate([
      this.listingRoute, $event.pageSize, $event.pageIndex + 1
    ], {
      relativeTo: this.route
    });
  }

  trackById(index: number, tag: Tag): number {
    return tag.id;
  }

  resetFilters(): void {
    this.resetRoute();
    this.filters.enable();
    this.filters.reset({
      dateSort: SortingEnum.DESC,
      type: undefined,
      search: undefined,
      category: undefined,
      nameSort: undefined
    });
    this.filters.controls.nameSort.disable();
    this.catFilter?.deselectAll();
    this.typeFilter?.deselectAll();
    this.cdr.markForCheck();
  }

  openCreateTagDialog(tagType: TagTypeEnum): void {
    const tagCreateReqObj: TagDialogReq = {
      tagType,
      isNew: true
    };
    const dialogRef = this.matDialog.open(TagCreateComponent, {
      data: tagCreateReqObj,
      minWidth: '25rem'
    });
    dialogRef.afterClosed().subscribe((tag: TagCore | undefined) => {
      if (tag) {
        const createTagObject: CreateTagRequest = {
          tag,
          ...this.filters.value,
          limit: this.pageSize,
          page: this.pageIndex
        };
        this.store.createTag$(createTagObject);
      }
    });
  }

  openUpdateDialog(tag: Tag): void {
    const updateTagObj: TagDialogReq = {
      tagType: tag.tagType,
      isNew: false,
      tag
    };
    const dialogRef = this.matDialog.open(TagCreateComponent, {
      data: updateTagObj,
      minWidth: '25rem'
    });
    dialogRef.afterClosed().subscribe((newTag: TagCore | undefined) => {
      if (newTag) {
        const updateTag: Tag = {
          ...tag,
          tagType: newTag.tagType,
          name: newTag.name,
          categoryName: newTag.categoryName
        };
        this.store.updateTag$(updateTag);
      }
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

  deleteTag(id: number) {
    const { category, type, dateSort, nameSort, search } = this.filters.value;
    const deleteObj: TagDeleteRequest = {
      id,
      dateSort,
      type,
      category,
      nameSort,
      search,
      limit: this.pageSize,
      page: this.pageIndex
    };
    this.store.deleteTag(deleteObj);
  }
}
