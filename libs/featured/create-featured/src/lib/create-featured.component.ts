import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {Featured, FeaturedCore, FeaturedStore} from '@hidden-innovation/featured/data-access';
import {MatDialog} from '@angular/material/dialog';
import {TestSelectorComponent, TestSelectorData} from '@hidden-innovation/shared/ui/test-selector';
import {Test} from '@hidden-innovation/test/data-access';
import {
  ContentSelectorOpType,
  FeaturedNameEnum,
  OrderedContent,
  PackContentTypeEnum
} from '@hidden-innovation/shared/models';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup} from '@ngneat/reactive-forms';
import {map, switchMap} from 'rxjs/operators';
import {HotToastService} from '@ngneat/hot-toast';
import {NumericValueType, RxwebValidators} from '@rxweb/reactive-form-validators';
import {ConstantDataService, FormValidationService} from '@hidden-innovation/shared/form-config';
import {AspectRatio, Media} from '@hidden-innovation/media';
import {UiStore} from '@hidden-innovation/shared/store';
import {ContentCore, LessonCore, Pack} from '@hidden-innovation/pack/data-access';
import {QuestionnaireExtended} from '@hidden-innovation/questionnaire/data-access';
import {TestGroup} from '@hidden-innovation/test-group/data-access';
import {Observable} from 'rxjs';
import {TestGroupSelectorComponent, TestGroupSelectorData} from '@hidden-innovation/shared/ui/test-group-selector';
import {
  QuestionnaireSelectorComponent,
  QuestionnaireSelectorData
} from '@hidden-innovation/shared/ui/questionnaire-selector';
import {PackSelectorComponent, PackSelectorData} from '@hidden-innovation/shared/ui/pack-selector';
import {TitleCasePipe} from '@angular/common';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

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
    bottomText: new FormControl('', [
      ...this.formValidationService.requiredFieldValidation,
      RxwebValidators.maxLength({
        value: this.formValidationService.FIELD_VALIDATION_VALUES.SPOTLIGHT_BUTTON_LENGTH
      })
    ]),
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
    packIds: new FormControl<OrderedContent[]>([]),
    questionnaireIds: new FormControl<OrderedContent[]>([]),
    singleTestIds: new FormControl<OrderedContent[]>([]),
    testGroupIds: new FormControl<OrderedContent[]>([]),
    content: new FormControl<ContentCore[]>([]),

  });

  aspectRatio = AspectRatio;
  featuredType = FeaturedNameEnum;
  packContentTypeEnum = PackContentTypeEnum;

  featuredID?: number;
  selectedFeatured: Featured | undefined;
  type: PackContentTypeEnum | ContentSelectorOpType | undefined;

  private selectedTests: Test[] = [];
  private selectedPacks: Pack[] = [];
  private selectedContent: ContentCore[] = [];

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
    const {packIds, testGroupIds, singleTestIds, questionnaireIds, content} = this.featuredGroup.controls;
    const packCtrl: FormArray<OrderedContent> = packIds as FormArray<OrderedContent>;
    const testGroupCtrl: FormArray<OrderedContent> = testGroupIds as FormArray<OrderedContent>;
    const testCtrl: FormArray<OrderedContent> = singleTestIds as FormArray<OrderedContent>;
    const questionnaireCtrl: FormArray<OrderedContent> = questionnaireIds as FormArray<OrderedContent>;
    const contentCtrl: FormArray<ContentCore | LessonCore> = content as FormArray<ContentCore | LessonCore>;
    this.uiStore.state$.subscribe((state) => {
      this.selectedTests = state.selectedTests ?? [];
      this.selectedPacks = state.selectedPacks ?? [];
      this.selectedContent = state.selectedContent ?? [];
      const resetContentCtrls = () => {
        this.featuredGroup.patchValue({
          packIds: [],
          testGroupIds: [],
          singleTestIds: [],
          questionnaireIds: [],
          content: []
        });
      };
      let countIndex = 0;
      const setTestCtrl = (selectedTests: Test[]) => {
        testCtrl.setValue(selectedTests.map(({id}, i) => {
          countIndex++;
          return {
            id,
            order: countIndex
          };
        }));
      };
      const setTestGroupCtrl = (selectedTestGroups: TestGroup[]) => {
        testGroupCtrl.setValue(selectedTestGroups.map(({id}, i) => {
          countIndex++;
          return {
            id,
            order: countIndex
          };
        }));
      };
      const setPacksCtrl = (selectedPacks: Pack[]) => {
        packCtrl.setValue(selectedPacks.map(({id}, i) => {
          countIndex++;
          return {
            id,
            order: countIndex
          };
        }));
      };
      const setContentCtrl = (selectedContent: (ContentCore)[]) => {
        contentCtrl.setValue(selectedContent.map(({contentId, name, type}, i) => {
          countIndex++;
          return {
            contentId: contentId,
            name,
            type,
            order: countIndex
          };
        }));
      };
      const setQuestionnaireCtrl = (selectedQuestionnaires: QuestionnaireExtended[]) => {
        questionnaireCtrl.setValue(selectedQuestionnaires.map(({id}, i) => {
          countIndex++;
          return {
            id,
            order: countIndex
          };
        }));
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
        setContentCtrl(state.selectedContent ?? []);
        // setTestGroupCtrl(state.selectedTestGroups ?? []);
        // setTestCtrl(state.selectedTests as Test[] ?? []);
        // setQuestionnaireCtrl(state.selectedQuestionnaires ?? []);
        // setPacksCtrl(state.selectedPacks ?? []);
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


  transformFeaturedName(name: FeaturedNameEnum | undefined): string {
    return name ? this.titleCasePipe.transform(name).replace(/_/g, ' ') : '--';
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
      questionnaires,
      content
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
      selectedTestGroups: testGroups,
      selectedContent: content
    });
  }

  disableNonSpotlightFields(): void {
    const {bottomText, heading, subHeading, posterId} = this.featuredGroup.controls;
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
      selectedLessons: [],
    });
  }

  openTestSelector(): void {
    if (this.isSpotlight) {
      this.type = PackContentTypeEnum.SINGLE;
    }

    const data: TestSelectorData = {
      type: this.isFeaturedTest ? ContentSelectorOpType.OTHER : ContentSelectorOpType.SINGLE,
      limit: this.isSpotlight
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
      type: this.isFeaturedTest ? ContentSelectorOpType.OTHER : ContentSelectorOpType.SINGLE,
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
      type: this.isFeaturedTest ? ContentSelectorOpType.OTHER : ContentSelectorOpType.SINGLE,
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


  packDragEvent($event: CdkDragDrop<Pack>): void {
    const selectedPacks = this.selectedPacks ? [...this.selectedPacks] : [];
    moveItemInArray(selectedPacks, $event.previousIndex, $event.currentIndex);
    this.uiStore.patchState({
      selectedPacks
    });
  }

  testDragEvent($event: CdkDragDrop<Test>): void {
    const selectedTests = this.selectedTests ? [...this.selectedTests] : [];
    moveItemInArray(selectedTests, $event.previousIndex, $event.currentIndex);
    this.uiStore.patchState({
      selectedTests
    });
  }

  contentDragEvent($event: CdkDragDrop<ContentCore>): void {
    const selectedContent = this.selectedContent ? [...this.selectedContent] : [];
    moveItemInArray(selectedContent, $event.previousIndex, $event.currentIndex);
    this.uiStore.patchState({
      selectedContent
    });
  }
}
