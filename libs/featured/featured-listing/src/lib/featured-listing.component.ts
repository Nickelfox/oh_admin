import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  Featured,
  FeaturedListingFilters,
  FeaturedLocalState,
  FeaturedStore
} from '@hidden-innovation/featured/data-access';
import { MatTableDataSource } from '@angular/material/table';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { FeaturedNameEnum, SortingEnum, TagCategoryEnum } from '@hidden-innovation/shared/models';
import { Router } from '@angular/router';


@Component({
  selector: 'hidden-innovation-featured-listing',
  templateUrl: './featured-listing.component.html',
  styleUrls: ['./featured-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class FeaturedListingComponent implements OnInit {
  _dummyFeatured: FeaturedLocalState[] = [
    {
      name: FeaturedNameEnum.SPOTLIGHT,
      location: 'HOME',
      items: 0,
      updated_at: ''
    },
    {
      name: FeaturedNameEnum.FEATURED_PACKS,
      location: 'HOME',
      items: 0,
      updated_at: ''
    },
    {
      name: FeaturedNameEnum.FEATURED_TESTS,
      location: 'HOME',
      items: 0,
      updated_at: ''
    },
    {
      name: FeaturedNameEnum.PACKS,
      location: TagCategoryEnum.CARDIO,
      items: 0,
      updated_at: ''
    },
    {
      name: FeaturedNameEnum.PACKS,
      location: TagCategoryEnum.LIFESTYLE,
      items: 0,
      updated_at: ''
    },
    {
      name: FeaturedNameEnum.PACKS,
      location: TagCategoryEnum.FUNCTION,
      items: 0,
      updated_at: ''
    },
    {
      name: FeaturedNameEnum.PACKS,
      location: TagCategoryEnum.MOBILE,
      items: 0,
      updated_at: ''
    },
    {
      name: FeaturedNameEnum.PACKS,
      location: TagCategoryEnum.STRENGTH,
      items: 0,
      updated_at: ''
    }

  ];

  displayedColumns: string[] = ['name', 'location', 'updated_at', 'items', 'action'];
  featured: MatTableDataSource<FeaturedLocalState> = new MatTableDataSource<FeaturedLocalState>();


  filters: FormGroup<FeaturedListingFilters> = new FormGroup<FeaturedListingFilters>({
    dateSort: new FormControl(SortingEnum.DESC)
  });


  constructor(
    public constantDataService: ConstantDataService,
    public store: FeaturedStore,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.featured = new MatTableDataSource<FeaturedLocalState>(this.localData);
    this.refreshList();

  }

  get localData(): FeaturedLocalState[] {
    return this._dummyFeatured;
  }

  set localData(featured: FeaturedLocalState[]) {
    this._dummyFeatured = [...featured];
  }

  refreshList(): void {
    const { dateSort } = this.filters.value;
    this.store.getFeaturedList$({
      dateSort
    });
  }

  getItemsCount(feature: Featured): number {
    let count = 0;
    switch (feature.name) {
      case FeaturedNameEnum.SPOTLIGHT:
        count += feature.testGroupIds?.length ?? 0;
        count += feature.singleTestIds?.length ?? 0;
        count += feature.questionnaireIds?.length ?? 0;
        count += feature.packIds?.length ?? 0;
        return count ?? 0;
      case FeaturedNameEnum.PACKS:
        return feature.packIds?.length ?? 0;
      case FeaturedNameEnum.FEATURED_TESTS:
        return feature.singleTestIds?.length ?? 0;
      case FeaturedNameEnum.FEATURED_PACKS:
        return feature.packIds?.length ?? 0;
      default:
        return 0;
    }
  }

  ngOnInit(): void {
    this.store.featuredList$.subscribe(
      (res) => {
        res.forEach(feature => this.localData = this.localData.map(data => {
              if ((data.name === FeaturedNameEnum[feature.name]) && (feature.name !== 'PACKS')) {
                return {
                  ...data,
                  items: this.getItemsCount(feature),
                  updated_at: feature.updatedAt
                };
              } else {
                return {
                  ...data,
                  items: this.getItemsCount(feature),
                  updated_at: TagCategoryEnum[feature.location as TagCategoryEnum] ? feature.updatedAt : ''
                };
              }
            }
          )
        );
        this.cdr.markForCheck();
      }
    );
  }
}
