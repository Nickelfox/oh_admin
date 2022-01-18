import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Featured, FeaturedCore, FeaturedListingFilters, FeaturedStore} from '@hidden-innovation/featured/data-access';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog} from '@angular/material/dialog';
import {TestSelectorComponent} from '@hidden-innovation/shared/ui/test-selector';
import {Test, TestStore} from '@hidden-innovation/test/data-access';
import {FeaturedNameEnum, SortingEnum, TagCategoryEnum} from '@hidden-innovation/shared/models';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, ValidatorFn} from '@ngneat/reactive-forms';
import {switchMap} from "rxjs/operators";
import {HotToastService} from "@ngneat/hot-toast";
import {NumericValueType, RxwebValidators} from "@rxweb/reactive-form-validators";
import {ConstantDataService, FormValidationService} from "@hidden-innovation/shared/form-config";
import {AspectRatio} from "@hidden-innovation/media";

@Component({
  selector: 'hidden-innovation-create-featured',
  templateUrl: './create-featured.component.html',
  styleUrls: ['./create-featured.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFeaturedComponent implements OnInit {

  requiredFieldValidation: ValidatorFn[] = [
    RxwebValidators.required(),
    RxwebValidators.notEmpty()
  ];

  featuredGroup:FormGroup<FeaturedCore> = new FormGroup<FeaturedCore>({
    name: new FormControl(FeaturedNameEnum.SPOTLIGHT,[...this.requiredFieldValidation]),
    location: new FormControl(TagCategoryEnum.CARDIO,[...this.requiredFieldValidation]),
    bottomText: new FormControl<string | undefined>(''),
    heading: new FormControl<string | undefined>(''),
    subHeading: new FormControl<string | undefined>(''),
    posterId: new FormControl(undefined, [
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]),
    packIds: new FormControl([]),
    questionnaireIds: new FormControl([]),
    singleTestIds: new FormControl([]),
    testGroupIds: new FormControl([])
  })

  aspectRatio = AspectRatio;
  featuredID? : number ;
  featuredType = FeaturedNameEnum;
  selection = new SelectionModel<FeaturedCore>(true, []);
  filters: FormGroup<FeaturedListingFilters> = new FormGroup<FeaturedListingFilters>({
    dateSort: new FormControl(SortingEnum.DESC)
  });

  selectedFeatured: Featured | undefined;

  constructor(
    private hotToastService: HotToastService,
    public formValidationService: FormValidationService,
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public store: FeaturedStore,
    public router: Router,
    public route: ActivatedRoute,
    public constantDataService: ConstantDataService,
  ) {
    this.route.data.pipe(
      switchMap(_ => this.route.params)
    ).subscribe((res) => {
        this.featuredID = res['id'];
        if (!this.featuredID) {
          this.hotToastService.error('Error occurred while fetching details');
          return;
        }
      this.store.selectedFeatured$.subscribe((feat) => {
        if (feat) {
          this.populateFeatured(feat);
        }
      });

        this.store.getFeaturedDetails$({
          id: this.featuredID
        });
    })

  }


  // parseFeatured(featured: FeaturedCore[]): FeaturedCore[] {
  //   return featured ? featured.map(feature => {
  //     return {
  //       ...feature,
  //     };
  //   }) : [];
  // }


  populateFeatured(feature:Featured):void{
    const {
      name,
      location,
      bottomText,
      heading,
      subHeading,
      poster,
      packIds,
      testGroupIds,
      singleTestIds,
      questionnaireIds
    } = feature
  this.featuredGroup.patchValue({
    name,
    location,
    bottomText,
    heading,
    subHeading,
    posterId: poster?.id,
    packIds,
    testGroupIds,
    singleTestIds,
    questionnaireIds,
  })
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
