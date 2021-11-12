import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Tag, TagsStore } from '@hidden-innovation/tags/data-access';
import { Observable } from 'rxjs';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { CategoryEnum, TagType } from '@hidden-innovation/shared/models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'hidden-innovation-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'type', 'category', 'date_modified'];
  tags: MatTableDataSource<Tag> = new MatTableDataSource<Tag>();

  noData: Observable<boolean>;

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  categoryEnum = CategoryEnum;
  tagType = TagType;

  listingRoute = '/tags/listing/';


  constructor(
    public constantDataService: ConstantDataService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    public store: TagsStore
  ) {
    this.noData = this.tags.connect().pipe(map(data => data.length === 0));
    this.route.params.subscribe((params) => {
      this.pageIndex = params['index'];
      this.pageSize = params['size'];
      this.refreshList();
    });
  }

  ngOnInit(): void {
    this.store.state$.subscribe(
      ({tags}) => {
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

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  onPaginateChange($event: PageEvent): void {
    this.router.navigate([
      this.listingRoute, $event.pageSize, $event.pageIndex + 1
    ], {
      relativeTo: this.route
    });
  }

}
