import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Featured, FeaturedCore, FeaturedListingFilters, FeaturedStore } from '@hidden-innovation/featured/data-access';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { TestSelectorComponent } from '@hidden-innovation/shared/ui/test-selector';
import { Test } from '@hidden-innovation/test/data-access';
import { FeaturedNameEnum, PackContentTypeEnum, SortingEnum } from '@hidden-innovation/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ValidatorFn } from '@ngneat/reactive-forms';
import { switchMap } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { AspectRatio } from '@hidden-innovation/media';
import { UiStore } from '@hidden-innovation/shared/store';
import { Pack } from '@hidden-innovation/pack/data-access';
import { QuestionnaireExtended } from '@hidden-innovation/questionnaire/data-access';
import { TestGroup } from '@hidden-innovation/test-group/data-access';

@Component({
  selector: 'hidden-innovation-create-featured',
  templateUrl: './create-featured.component.html',
  styleUrls: ['./create-featured.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFeaturedComponent implements OnInit, OnDestroy {

  requiredFieldValidation: ValidatorFn[] = [
    RxwebValidators.required(),
    RxwebValidators.notEmpty()
  ];

  featuredGroup: FormGroup<FeaturedCore> = new FormGroup<FeaturedCore>({
    name: new FormControl({
      value: undefined,
      disabled: true
    }, [...this.requiredFieldValidation]),
    location: new FormControl({
      value: undefined,
      disabled: true
    }, [...this.requiredFieldValidation]),
    bottomText: new FormControl(''),
    heading: new FormControl(''),
    subHeading: new FormControl(''),
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
  });

  aspectRatio = AspectRatio;
  featuredID?: number;
  featuredType = FeaturedNameEnum;
  selection = new SelectionModel<FeaturedCore>(true, []);
  filters: FormGroup<FeaturedListingFilters> = new FormGroup<FeaturedListingFilters>({
    dateSort: new FormControl(SortingEnum.DESC)
  });

  selectedFeatured: Featured | undefined;
  packContentTypeEnum = PackContentTypeEnum;

  type: PackContentTypeEnum | undefined;

  constructor(
    private hotToastService: HotToastService,
    public formValidationService: FormValidationService,
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public store: FeaturedStore,
    public router: Router,
    public uiStore: UiStore,
    public route: ActivatedRoute,
    public constantDataService: ConstantDataService
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
    });
    const { packIds, testGroupIds, singleTestIds, questionnaireIds } = this.featuredGroup.controls;
    this.uiStore.state$.subscribe((state) => {
      const setTestCtrl = (selectedTests: Test[]) => {
        singleTestIds.setValue(selectedTests.map(t => t.id));
      };
      const setTestGroupCtrl = (selectedTestGroups: TestGroup[]) => {
        testGroupIds.setValue(selectedTestGroups.map(t => t.id));
      };
      const setPacksCtrl = (selectedPacks: Pack[]) => {
        packIds.setValue(selectedPacks.map(t => t.id));
      };
      const setQuestionnaireCtrl = (selectedQuestionnaires: QuestionnaireExtended[]) => {
        questionnaireIds.setValue(selectedQuestionnaires.map(t => t.id));
      };
      if (this.selectedFeatured?.name === FeaturedNameEnum.SPOTLIGHT && this.type) {
        switch (this.type) {
          case PackContentTypeEnum.SINGLE:
            this.restoreSelectedState();
            setTestCtrl(state.selectedTests ?? []);
            return;
          case PackContentTypeEnum.GROUP:
            this.restoreSelectedState();
            setTestGroupCtrl(state.selectedTestGroups ?? []);
            return;
          case PackContentTypeEnum.PACK:
            this.restoreSelectedState();
            setPacksCtrl(state.selectedPacks ?? []);
            return;
          case PackContentTypeEnum.QUESTIONNAIRE:
            this.restoreSelectedState();
            setQuestionnaireCtrl(state.selectedQuestionnaires ?? []);
        }
        return;
      }
      if (this.selectedFeatured?.name === FeaturedNameEnum.FEATURED_TESTS) {
        this.restoreSelectedState();
        setTestCtrl(state.selectedTests as Test[] ?? []);
        return;
      }
      this.restoreSelectedState();
      setPacksCtrl(state.selectedPacks as Pack[] ?? []);
    });
  }

  get posterIDctrl(): FormControl<number | undefined> {
    return this.featuredGroup.controls.posterId;
  }

  get isSpotlight(): boolean {
    return this.selectedFeatured?.name === FeaturedNameEnum.SPOTLIGHT;
  }

  populateFeatured(feature: Featured): void {
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
    } = feature;
    this.selectedFeatured = feature;

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
      questionnaireIds
    });
  }

  ngOnInit(): void {
  }

  restoreSelectedState(): void {
    this.uiStore.patchState({
      selectedContent: [],
      selectedQuestionnaires: [],
      selectedTests: [],
      selectedTestGroups: [],
      selectedLessons: []
    });
  }

  openTestSelector(): void {
    if (this.isSpotlight) {
      this.type = PackContentTypeEnum.SINGLE;
    }
    this.matDialog.open(TestSelectorComponent, {
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      role: 'dialog'
    });
  }

  ngOnDestroy(): void {
    this.store.patchState({
      selectedFeatured: undefined
    });
  }


}
