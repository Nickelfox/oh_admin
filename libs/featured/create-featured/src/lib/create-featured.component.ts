import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FeaturedCore, FeaturedListingFilters, FeaturedStore } from '@hidden-innovation/featured/data-access';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { TestSelectorComponent } from '@hidden-innovation/shared/ui/test-selector';
import { TestStore } from '@hidden-innovation/test/data-access';
import { FeaturedNameEnum, SortingEnum } from '@hidden-innovation/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';

@Component({
  selector: 'hidden-innovation-create-featured',
  templateUrl: './create-featured.component.html',
  styleUrls: ['./create-featured.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFeaturedComponent implements OnInit {

  readonly featuredID : number = 13 ;
  name = '';
  featuredType = FeaturedNameEnum;
  selection = new SelectionModel<FeaturedCore>(true, []);
  filters: FormGroup<FeaturedListingFilters> = new FormGroup<FeaturedListingFilters>({
    dateSort: new FormControl(SortingEnum.DESC)
  });

  // readonly featuredID?: number;

  constructor(
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public store: FeaturedStore,
    public router: Router,
    public route: ActivatedRoute
  ) {
    // if (!this.featuredID) return;
    this.store.getFeaturedDetails$({
      id: this.featuredID
    });
  }

  ngOnInit(): void {
    this.store.selectedFeatured$.subscribe((d) => console.log(d));
  }




  openTestSelector(): void {
    const dialogRef = this.matDialog.open(TestSelectorComponent, {
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      role: 'dialog'
    });
    dialogRef.afterClosed().subscribe((tests: TestStore[] | undefined) => {
      if (tests) {
        return;
      }
    });
  }


}
