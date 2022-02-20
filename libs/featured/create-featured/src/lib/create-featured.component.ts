import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Featured, FeaturedCore, FeaturedStore } from '@hidden-innovation/featured/data-access';
import { MatDialog } from '@angular/material/dialog';
import { TestSelectorComponent, TestSelectorData } from '@hidden-innovation/shared/ui/test-selector';
import { Test } from '@hidden-innovation/test/data-access';
import { ContentSelectorOpType, FeaturedNameEnum, PackContentTypeEnum } from '@hidden-innovation/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { map, switchMap } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { AspectRatio, Media } from '@hidden-innovation/media';
import { UiStore } from '@hidden-innovation/shared/store';
import { Pack } from '@hidden-innovation/pack/data-access';
import { QuestionnaireExtended } from '@hidden-innovation/questionnaire/data-access';
import { TestGroup } from '@hidden-innovation/test-group/data-access';
import { Observable } from 'rxjs';
import { TestGroupSelectorComponent, TestGroupSelectorData } from '@hidden-innovation/shared/ui/test-group-selector';
import {
  QuestionnaireSelectorComponent,
  QuestionnaireSelectorData
} from '@hidden-innovation/shared/ui/questionnaire-selector';
import { PackSelectorComponent, PackSelectorData } from '@hidden-innovation/shared/ui/pack-selector';
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'hidden-innovation-create-featured',
  templateUrl: './create-featured.component.html',
  styleUrls: ['./create-featured.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFeaturedComponent implements OnDestroy {

  featuredGroup: FormGroup<FeaturedCore> = new FormGroup<FeaturedCore>({
    name: new FormControl({
      value: undefined,
      disabled: true
    }, [
      ...this.formValidationService.requiredFieldValidation,
      RxwebValidators.maxLength({
        value: this.formValidationService.FIELD_VALIDATION_VALUES.PACK_NAME_LENGTH
      })
    ]),
    location: new FormControl({
      value: undefined,
      disabled: true
    }, [...this.formValidationService.requiredFieldValidation]),
    bottomText: new FormControl('', [...this.formValidationService.requiredFieldValidation]),
    heading: new FormControl('', [
      ...this.formValidationService.requiredFieldValidation
    ]),
    subHeading: new FormControl('', [
      ...this.formValidationService.requiredFieldValidation
    ]),
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
  featuredType = FeaturedNameEnum;
  packContentTypeEnum = PackContentTypeEnum;

  featuredID?: number;
  selectedFeatured: Featured | undefined;
  type: PackContentTypeEnum | undefined;

  constructor(
    private hotToastService: HotToastService,
    public formValidationService: FormValidationService,
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public store: FeaturedStore,
    public router: Router,
    private titleCasePipe: TitleCasePipe,
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
      const resetContentCtrls = () => {
        this.featuredGroup.patchValue({
          packIds: [],
          testGroupIds: [],
          singleTestIds: [],
          questionnaireIds: []
        });
      };
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
            resetContentCtrls();
            setTestCtrl(state.selectedTests ?? []);
            break;
          case PackContentTypeEnum.GROUP:
            resetContentCtrls();
            setTestGroupCtrl(state.selectedTestGroups ?? []);
            break;
          case PackContentTypeEnum.PACK:
            resetContentCtrls();
            setPacksCtrl(state.selectedPacks ?? []);
            break;
          case PackContentTypeEnum.QUESTIONNAIRE:
            resetContentCtrls();
            setQuestionnaireCtrl(state.selectedQuestionnaires ?? []);
            break;
        }
      } else if (this.selectedFeatured?.name === FeaturedNameEnum.FEATURED_TESTS) {
        resetContentCtrls();
        setTestCtrl(state.selectedTests as Test[] ?? []);
      } else {
        resetContentCtrls();
        setPacksCtrl(state.selectedPacks as Pack[] ?? []);
      }
    });
  }

  get posterIDctrl(): FormControl<number | undefined> {
    return this.featuredGroup.controls.posterId;
  }

  get isSpotlight(): boolean {
    return this.selectedFeatured?.name === FeaturedNameEnum.SPOTLIGHT;
  }

  get isFeaturedTest(): boolean {
    return this.selectedFeatured?.name === FeaturedNameEnum.FEATURED_TESTS;
  }

  get selectedPosterData(): Observable<Media | undefined> {
    return this.store.selectedFeatured$.pipe(
      map(featured => featured?.poster)
    );
  }



  transformFeaturedName(name:FeaturedNameEnum | undefined):string {
    return name ? this.titleCasePipe.transform(name).replace(/_/g,' ') : '--';
  }

  populateFeatured(feature: Featured): void {
    const {
      name,
      location,
      bottomText,
      heading,
      subHeading,
      poster,
      packs,
      tests,
      testGroups,
      questionnaires
    } = feature;
    this.selectedFeatured = feature;
    this.featuredGroup.patchValue({
      name,
      location,
      bottomText,
      heading,
      subHeading,
      posterId: poster?.id
    });
    this.restoreSelectedState();
    if (this.isSpotlight) {
      if (this.selectedFeatured?.tests.length) {
        this.type = PackContentTypeEnum.SINGLE;
      } else if (this.selectedFeatured?.testGroups.length) {
        this.type = PackContentTypeEnum.GROUP;
      } else if (this.selectedFeatured?.packs.length) {
        this.type = PackContentTypeEnum.PACK;
      } else if (this.selectedFeatured?.questionnaires?.length) {
        this.type = PackContentTypeEnum.QUESTIONNAIRE;
      }
    } else {
      this.disableNonSpotlightFields();
    }
    this.uiStore.patchState({
      selectedTests: tests,
      selectedPacks: packs,
      selectedQuestionnaires: questionnaires,
      selectedTestGroups: testGroups
    });
  }

  disableNonSpotlightFields(): void {
    const { bottomText, heading, subHeading, posterId } = this.featuredGroup.controls;
    bottomText.disable();
    heading.disable();
    subHeading.disable();
    posterId.disable();
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
    const data: TestSelectorData = {
      type: ContentSelectorOpType.SINGLE,
      limit: this.isSpotlight || this.isFeaturedTest,
    };
    this.matDialog.open(TestSelectorComponent, {
      data,
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      role: 'dialog'
    });
  }

  openTestGroupSelector(): void {
    if (this.isSpotlight) {
      this.type = PackContentTypeEnum.GROUP;
    }
    const data: TestGroupSelectorData = {
      type: ContentSelectorOpType.SINGLE,
      limit: this.isSpotlight
    };
    this.matDialog.open(TestGroupSelectorComponent, {
      data,
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      role: 'dialog'
    });
  }

  openQuestionnaireSelector(): void {
    if (this.isSpotlight) {
      this.type = PackContentTypeEnum.QUESTIONNAIRE;
    }
    const data: QuestionnaireSelectorData = {
      type: ContentSelectorOpType.SINGLE,
      limit: this.isSpotlight
    };
    this.matDialog.open(QuestionnaireSelectorComponent, {
      data,
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      role: 'dialog'
    });
  }

  openPacksSelector(): void {
    if (this.isSpotlight) {
      this.type = PackContentTypeEnum.PACK;
    }
    const data: PackSelectorData = {
      limit: this.isSpotlight
    };
    this.matDialog.open(PackSelectorComponent, {
      data,
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      role: 'dialog'
    });
  }

  ngOnDestroy(): void {
    this.restoreSelectedState();
    this.store.patchState({
      selectedFeatured: undefined
    });
  }

  submit() {
    this.featuredGroup.markAllAsTouched();
    this.featuredGroup.markAllAsDirty();
    if (this.featuredGroup.invalid) {
      this.hotToastService.error(this.formValidationService.formSubmitError);
      return;
    }
    if (!this.featuredID) {
      this.hotToastService.error('Error occurred while submitting details');
      return;
    }
    const featured: FeaturedCore = {
      name: this.featuredGroup.getRawValue().name,
      location: this.featuredGroup.getRawValue().location,
      ...this.featuredGroup.value
    };
    this.store.updateFeatured$({
      id: this.featuredID,
      featured
    });
  }

}
