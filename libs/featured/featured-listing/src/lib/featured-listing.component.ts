import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Featured, FeaturedLocalState, FeaturedStore } from '@hidden-innovation/featured/data-access';
import { MatTableDataSource } from '@angular/material/table';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { FeaturedNameEnum, TagCategoryEnum } from '@hidden-innovation/shared/models';
import { Router } from '@angular/router';


@Component({
  selector: 'hidden-innovation-featured-listing',
  templateUrl: './featured-listing.component.html',
  styleUrls: ['./featured-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class FeaturedListingComponent implements OnInit {
  displayedColumns: string[] = ['name', 'location', 'updated_at', 'items', 'action'];
  featured: MatTableDataSource<FeaturedLocalState> = new MatTableDataSource<FeaturedLocalState>();
  private _dummyFeatured: FeaturedLocalState[] = [
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

  constructor(
    public constantDataService: ConstantDataService,
    public store: FeaturedStore,
    private cdr: ChangeDetectorRef,
  ) {
    this.featured = new MatTableDataSource<FeaturedLocalState>(this.localData);
    this.refreshList();
  }

  get localData(): FeaturedLocalState[] {
    return this._dummyFeatured;
  }

  set localData(featured: FeaturedLocalState[]) {
    this._dummyFeatured = [...featured];
    this.featured = new MatTableDataSource<FeaturedLocalState>(this.localData);
  }

  refreshList(): void {
    this.store.getFeaturedList$();
  }

  getItemsCount(feature: Featured): number {
    let count = 0;
    switch (feature.name) {
      case FeaturedNameEnum.SPOTLIGHT:
        count += feature.testGroups?.length ?? 0;
        count += feature.tests?.length ?? 0;
        count += feature.questionnaires?.length ?? 0;
        count += feature.packs?.length ?? 0;
        return count ?? 0;
      case FeaturedNameEnum.PACKS:
        return feature.packs?.length ?? 0;
      case FeaturedNameEnum.FEATURED_TESTS:
        return feature.tests?.length ?? 0;
      case FeaturedNameEnum.FEATURED_PACKS:
        return feature.packs?.length ?? 0;
      default:
        return 0;
    }
  }

  ngOnInit(): void {
    this.store.featuredList$.subscribe(
      (res) => {
        res.forEach(feature => this.localData = this.localData.map(data => {
            if ((data.name === feature.name) && (data.location === feature.location)) {
              return {
                ...data,
                id: feature.id ?? undefined,
                items: this.getItemsCount(feature),
                updated_at: feature.updatedAt ?? ''
              };
            } else {
              return data;
            }
          })
        );
        this.cdr.markForCheck();
      }
    );
  }
}
