import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FeaturedListingFilters, FeaturedLocalState, FeaturedStore} from '@hidden-innovation/featured/data-access';
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
  _dummyFeatured: FeaturedLocalState[] = [
    {
      name: FeaturedNameEnum.SPOTLIGHT,
      location: "HOME",
      items: 0,
      updated_at: ''
    },
    {
      name: FeaturedNameEnum.FEATURED_PACKS,
      location: "HOME",
      items: 0,
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


  displayedColumns: string[] = ['name', 'location', 'updated_at', 'items', 'action'];
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
    this.featured = new MatTableDataSource<FeaturedLocalState>(this._dummyFeatured);
    this.refreshList();

  }


  refreshList(): void {
    const {dateSort} = this.filters.value;
    this.store.getFeaturedList$({
      dateSort
    });

  }


  ngOnInit(): void {
    this.store.featuredList$.subscribe(
      (res) => {
        res.forEach(feature => {
          if (FeaturedNameEnum[feature.name]) {
            this.localData = this.localData.map(data => {

                if ((data.name === FeaturedNameEnum[feature.name]) && (feature.name !== 'PACKS')) {
                  //   data.updated_at = feature.updatedAt;
                  return {
                    ...data,
                    updated_at: feature.updatedAt,

                  }
                } else {
                  return {
                    ...data,
                    updated_at: TagCategoryEnum[feature.location as TagCategoryEnum] ? feature.updatedAt : ''
                  }
                }
              }
            )
          }
        })
        this.cdr.markForCheck();
      }
    );
  }



  get localData(): FeaturedLocalState[] {
    return this._dummyFeatured;
  }

  set localData(featured: FeaturedLocalState[]) {
    this._dummyFeatured = [...featured];
  }


}

//   if (feature.tests !== null && feature.tests !== undefined ) {
//     data.items =  feature.tests.length;
//     console.log(feature.tests, data)
//   }
//   if (feature.packs !== null && feature.packs !== undefined) {
//     count += feature.packs.length;
//     data.items = count;
//   }
//   if (feature.questionnaires !== null && feature.questionnaires !== undefined) {
//     count += feature.questionnaires.length;
//     data.items = count;
//   }
//   if (feature.testGroups !== null && feature.testGroups !== undefined) {
//     count += feature.testGroups.length;
//     data.items = count;
//   }
