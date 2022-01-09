import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FeaturedListingFilters, FeaturedLocalState, FeaturedStore} from '@hidden-innovation/featured/data-access';
import {DateTime} from 'luxon';
import {MatTableDataSource} from '@angular/material/table';
import {ConstantDataService} from '@hidden-innovation/shared/form-config';
import {FormControl, FormGroup} from "@ngneat/reactive-forms";
import {FeaturedNameEnum, SortingEnum, TagCategoryEnum} from "@hidden-innovation/shared/models";
import {Router} from "@angular/router";


@Component({
  selector: 'hidden-innovation-featured-listing',
  templateUrl: './featured-listing.component.html',
  styleUrls: ['./featured-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class FeaturedListingComponent implements OnInit {
  dummyFeatured: FeaturedLocalState[] = [
    {
      name: FeaturedNameEnum.SPOTLIGHT,
      location: "HOME",
      items: 2,
      updated_at: ''
    },
    {
      name: FeaturedNameEnum.FEATURED_PACKS,
      location: "HOME",
      items: 2,
      updated_at: ''
    },
    {
      name: FeaturedNameEnum.FEATURED_TESTS,
      location: "HOME",
      items: 2,
      updated_at: ''
    },
    {
      name: FeaturedNameEnum.PACKS,
      location: TagCategoryEnum.CARDIO,
      items: 2,
      updated_at: ''
    },
    {
      name: FeaturedNameEnum.PACKS,
      location: TagCategoryEnum.LIFESTYLE,
      items: 2,
      updated_at: ''
    },
    {
      name: FeaturedNameEnum.PACKS,
      location: TagCategoryEnum.FUNCTION,
      items: 2,
      updated_at: ''
    },
    {
      name: FeaturedNameEnum.PACKS,
      location: TagCategoryEnum.MOBILE,
      items: 2,
      updated_at: ''
    },
    {
      name: FeaturedNameEnum.PACKS,
      location: TagCategoryEnum.STRENGTH,
      items: 2,
      updated_at: ''
    },

  ];


  displayedColumns: string[] = ['name', 'location', 'updated_at', 'items'];
  featured: MatTableDataSource<FeaturedLocalState> = new MatTableDataSource<FeaturedLocalState>();

  filters: FormGroup<FeaturedListingFilters> = new FormGroup<FeaturedListingFilters>({
    dateSort: new FormControl(SortingEnum.DESC),
  });


  constructor(
    public constantDataService: ConstantDataService,
    public store: FeaturedStore,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.featured = new MatTableDataSource<FeaturedLocalState>(this.dummyFeatured);
    this.refreshList();
    this.updateDate();

  }


  refreshList(): void {
    const {dateSort} = this.filters.value;
    this.store.getFeaturedList$({
      dateSort
    });

  }


  ngOnInit(): void {
    this.store.featuredList$.subscribe(
      () => {
        this.cdr.markForCheck();
      }
    );
  }

  getLocalData() {
    return this.dummyFeatured.map(value => value);
  }

  updateDate() {
    return (this.store.featuredList$.subscribe(
      (d => d.map(res => {
          if (FeaturedNameEnum[res.name]) {
            this.getLocalData().map(data => {
              if ((data.name === FeaturedNameEnum[res.name]) && (res.name !== 'PACKS')) {
                data.updated_at = res.updatedAt;
              } else {
                switch (res.location) {
                  case TagCategoryEnum.CARDIO:
                    data.updated_at = res.updatedAt;
                    break;
                }
              }
            })
          }
        }))
    ))}


}
