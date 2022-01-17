import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  Featured,
  FeaturedCore,
  FeaturedListingFilters,
  FeaturedResponse, FeaturedResponseData,
  FeaturedStore
} from '@hidden-innovation/featured/data-access';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { TestSelectorComponent } from '@hidden-innovation/shared/ui/test-selector';
import { TestStore } from '@hidden-innovation/test/data-access';
import {FeaturedNameEnum, OperationTypeEnum, QuestionTypeEnum, SortingEnum} from '@hidden-innovation/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import {filter, switchMap, tap} from "rxjs/operators";
import {HotToastService} from "@ngneat/hot-toast";
import {QuestionExtended} from "@hidden-innovation/questionnaire/data-access";

@Component({
  selector: 'hidden-innovation-create-featured',
  templateUrl: './create-featured.component.html',
  styleUrls: ['./create-featured.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFeaturedComponent implements OnInit {

  featuredID? : number ;
  opType?: OperationTypeEnum;
  featuredType = FeaturedNameEnum;
  selection = new SelectionModel<FeaturedCore>(true, []);
  filters: FormGroup<FeaturedListingFilters> = new FormGroup<FeaturedListingFilters>({
    dateSort: new FormControl(SortingEnum.DESC)
  });


  constructor(
    private hotToastService: HotToastService,
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public store: FeaturedStore,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.route.data.pipe(
      switchMap(_ => this.route.params)
    ).subscribe((res) => {
        this.featuredID = res['id'];
        if (!this.featuredID) {
          this.hotToastService.error('Error occurred while fetching details');
          return;
        }

        this.store.getFeaturedDetails$({
          id: this.featuredID
        });
    })
  }


  parseFeatured(featured: FeaturedCore[]): FeaturedCore[] {
    return featured ? featured.map(feature => {
      return {
        ...feature,
      };
    }) : [];
  }



  ngOnInit(): void {

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
