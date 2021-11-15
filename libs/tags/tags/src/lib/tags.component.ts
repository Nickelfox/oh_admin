import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Tag, TagCore, TagDialogReq, TagsStore } from '@hidden-innovation/tags/data-access';
import { Observable } from 'rxjs';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { TagCategoryEnum, TagTypeEnum } from '@hidden-innovation/shared/models';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TagCreateComponent } from '@hidden-innovation/shared/ui/tag-create';

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

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  categoryEnum = TagCategoryEnum;
  tagType = TagTypeEnum;

  tagTypeIte = Object.values(TagTypeEnum);

  listingRoute = '/tags/listing/';


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
        this.cdr.markForCheck();
      }
    );
  }

  refreshList(): void {
    this.store.getTags$({
      page: this.pageIndex,
      limit: this.pageSize
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
        this.store.createTag$({
          tag,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        });
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

}
