import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FeaturedLocalState, FeaturedListingFilters, FeaturedStore} from '@hidden-innovation/featured/data-access';
import {DateTime} from 'luxon';
import {MatTableDataSource} from '@angular/material/table';
import {ConstantDataService} from '@hidden-innovation/shared/form-config';
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {FormControl, FormGroup} from "@ngneat/reactive-forms";
import {FeaturedNameEnum, SortingEnum, TagCategoryEnum} from "@hidden-innovation/shared/models";
import {ActivatedRoute, Router} from "@angular/router";


export enum PackType  {
  HOME = 'HOME',
  CARDIO = 'CARDIO',
  LIFESTYLE = 'LIFESTYLE',
  FUNCTION = 'FUNCTION',
  MOVEMENT = 'MOVEMENT',
  STRENGTH = 'STRENGTH'
}

export const dummyFeatured: FeaturedLocalState[] = [
  {
    name: FeaturedNameEnum.SPOTLIGHT,
    location: "HOME",
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },
  {
    name: FeaturedNameEnum.FEATURED_PACKS,
    location: "HOME",
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },
  {
    name: FeaturedNameEnum.FEATURED_TESTS,
    location: "HOME",
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },
  {
    name: FeaturedNameEnum.PACKS,
    location: TagCategoryEnum.CARDIO,
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },
  {
    name: FeaturedNameEnum.PACKS,
    location: TagCategoryEnum.LIFESTYLE,
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },
  {
    name: FeaturedNameEnum.PACKS,
    location: TagCategoryEnum.FUNCTION,
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },
  {
    name: FeaturedNameEnum.PACKS,
    location: TagCategoryEnum.MOBILE,
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },
  {
    name: FeaturedNameEnum.PACKS,
    location: TagCategoryEnum.STRENGTH,
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },

];

@Component({
  selector: 'hidden-innovation-featured-listing',
  templateUrl: './featured-listing.component.html',
  styleUrls: ['./featured-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})





export class FeaturedListingComponent implements OnInit {
  displayedColumns: string[] = ['name','location','updated_at', 'items'];
  featured: MatTableDataSource<FeaturedLocalState> = new MatTableDataSource<FeaturedLocalState>();


  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  filters: FormGroup<FeaturedListingFilters> = new FormGroup<FeaturedListingFilters>({
    dateSort: new FormControl(SortingEnum.DESC),
    nameSort: new FormControl({ value: undefined, disabled: true }),
    search: new FormControl(undefined)
    // published: new FormControl(undefined)
  });


  noData: Observable<boolean>;
  listingRoute = '/packs/listing/';

  constructor(
    public constantDataService: ConstantDataService,
    public store: FeaturedStore,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.noData = this.featured.connect().pipe(map(data => data.length === 0));
    this.featured = new MatTableDataSource<FeaturedLocalState>(dummyFeatured);
    this.route.params.subscribe((params) => {
      this.pageIndex = params['index'];
      this.pageSize = params['size'];
      this.refreshList();
    });
  }

  resetRoute(): void {
    this.router.navigate([
      this.listingRoute, this.constantDataService.PaginatorData.pageSize, this.constantDataService.PaginatorData.pageIndex
    ], {
      relativeTo: this.route
    });
  }
  refreshList(): void{
    const { nameSort, dateSort, search} = this.filters.value;
    this.store.getFeatureds$({
      page: this.pageIndex,
      limit: this.pageSize,
      dateSort,
      search,
      nameSort
    });
  }
  ngOnInit(): void {
    this.store.featureds$.subscribe(
      (featureds) => {
        // this.packs = new MatTableDataSource<Pack>(packs);
        // this.noData = this.featured.connect().pipe(map(data => data.length === 0));
        if (!featureds?.length && (this.pageIndex > this.constantDataService.PaginatorData.pageIndex)) {
          this.resetRoute();
        }
        this.cdr.markForCheck();
      }
    );
  }
}
