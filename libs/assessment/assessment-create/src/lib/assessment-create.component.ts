import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UiStore } from '@hidden-innovation/shared/store';
import { HotToastService } from '@ngneat/hot-toast';
import { ActivatedRoute } from '@angular/router';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Assessment, AssessmentCore, AssessmentStore } from '@hidden-innovation/assessment/data-access';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { map, switchMap } from 'rxjs/operators';
import { AspectRatio, Media } from '@hidden-innovation/media';
import { Observable } from 'rxjs';
import {
  ContentSelectorOpType,
  GenericDialogPrompt,
  PackContentTypeEnum,
  TagCategoryEnum
} from '@hidden-innovation/shared/models';
import { BreadcrumbService } from 'xng-breadcrumb';
import { TitleCasePipe } from '@angular/common';
import { ContentCore } from '@hidden-innovation/pack/data-access';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';
import { TestSelectorComponent, TestSelectorData } from '@hidden-innovation/shared/ui/test-selector';
import {
  QuestionnaireSelectorComponent,
  QuestionnaireSelectorData
} from '@hidden-innovation/shared/ui/questionnaire-selector';
import { TestGroupSelectorComponent, TestGroupSelectorData } from '@hidden-innovation/shared/ui/test-group-selector';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'hidden-innovation-assessment-create',
  templateUrl: './assessment-create.component.html',
  styleUrls: ['./assessment-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentCreateComponent implements OnDestroy {

  assessmentGroup: FormGroup<AssessmentCore> = new FormGroup<AssessmentCore>({
    name: new FormControl(undefined, [
      ...this.formValidationService.requiredFieldValidation,
      RxwebValidators.maxLength({
        value: this.formValidationService.FIELD_VALIDATION_VALUES.PACK_NAME_LENGTH
      })
    ]),
    count: new FormControl<number>(undefined),
    category: new FormControl<TagCategoryEnum>(undefined),
    about: new FormControl('', [
      ...this.formValidationService.requiredFieldValidation,
      RxwebValidators.maxLength({
        value: 500
      })
    ]),
    whatYouWillGetOutOfIt: new FormControl('', [...this.formValidationService.requiredFieldValidation]),
    whatYouWillNeed: new FormControl('', [...this.formValidationService.requiredFieldValidation]),
    howItWorks: new FormControl('', [...this.formValidationService.requiredFieldValidation]),
    lockout: new FormControl(undefined, [
      ...this.formValidationService.requiredFieldValidation,
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      }),
      RxwebValidators.minNumber({
        value: 1
      })
    ]),
    imageId: new FormControl(undefined, [
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]),
    singleTestIds: new FormControl([]),
    questionnaireIds: new FormControl([]),
    content: new FormControl<ContentCore[]>([])
  });

  aspectRatio = AspectRatio;
  selectedAssessment: Assessment | undefined;

  constructor(
    public constantDataService: ConstantDataService,
    private matDialog: MatDialog,
    private hotToastService: HotToastService,
    public store: AssessmentStore,
    public route: ActivatedRoute,
    public uiStore: UiStore,
    public formValidationService: FormValidationService,
    private breadcrumbService: BreadcrumbService,
    private cdr: ChangeDetectorRef,
    private titleCasePipe: TitleCasePipe
  ) {
    this.route.data.pipe(
      switchMap(_ => this.route.params)
    ).subscribe((res) => {
      this.restoreSelectedState();
      this.assessmentGroup.patchValue({
        category: res['category'] as TagCategoryEnum
      });
      const { category } = this.assessmentGroup.value;
      if (!category) {
        this.hotToastService.error('Error occurred while fetching details');
        return;
      }
      this.breadcrumbService.set('/assessments/edit/:category', this.titleCasePipe.transform(category) + ' Assessment');
      this.store.selectedAssessment$.subscribe((assess) => {
        if (assess) {
          this.populateAssessment(assess);
        }
      });
      this.store.getAssessmentDetails$(category);
    });
    this.uiStore.selectedContent$.subscribe((contents) => {
      this.selectedContents = contents.map((c, i) => {
        return {
          ...c,
          order: i + 1
        };
      }) as ContentCore[];
      this.contentArrayCtrl.setValue(this.selectedContents);
      this.assessmentGroup.updateValueAndValidity();
      this.cdr.markForCheck();
    });
    this.assessmentGroup.controls.content.valueChanges.subscribe(_ => {
      this.assessmentGroup.updateValueAndValidity();
      this.cdr.markForCheck();
    });
  }

  private _selectedContents: ContentCore[] = [];
  get selectedContents(): ContentCore[] {
    return this._selectedContents ?? [];
  }

  set selectedContents(content) {
    this._selectedContents = content ?? [];
  }

  get contentArrayCtrl(): FormControl<ContentCore[]> {
    return this.assessmentGroup.controls.content as FormControl<ContentCore[]>;
  }

  get contentArrayExists(): boolean {
    return this.contentArrayCtrl.value?.length > 0;
  }

  get imageIDctrl(): FormControl<number | undefined> {
    return this.assessmentGroup.controls.imageId;
  }

  get selectedImageData(): Observable<Media | undefined> {
    return this.store.selectedAssessment$.pipe(
      map(assess => assess?.image)
    );
  }

  restoreSelectedState(): void {
    this.uiStore.patchState({
      selectedContent: []
    });
    this.store.patchState({
      selectedAssessment: undefined
    });
  }

  populateAssessment(assessment: Assessment): void {
    const {
      name,
      about,
      whatYouWillGetOutOfIt,
      whatYouWillNeed,
      lockout,
      howItWorks,
      category,
      image
    } = assessment;
    this.selectedAssessment = assessment;
    this.assessmentGroup.patchValue({
      about,
      whatYouWillGetOutOfIt,
      howItWorks,
      whatYouWillNeed,
      lockout,
      category,
      imageId: image?.id,
      name
    });
    this.uiStore.patchState({
      selectedContent: this.selectedAssessment?.content ?? []
    });
    this.cdr.markForCheck();
  }

  deleteSelectedContentPrompt(content: ContentCore): void {
    const contentType: string = content.type === PackContentTypeEnum.SINGLE ? 'TEST SINGLE' : content.type;
    const dialogData: GenericDialogPrompt = {
      title: `Remove ${contentType}?`,
      desc: `Are you sure you want to remove this ${this.titleCasePipe.transform(contentType)} from Assessment?`,
      action: {
        posTitle: 'Yes',
        negTitle: 'No',
        type: 'mat-primary'
      }
    };
    const dialogRef = this.matDialog.open(PromptDialogComponent, {
      data: dialogData,
      minWidth: '25rem'
    });
    dialogRef.afterClosed().subscribe((proceed: boolean) => {
      if (proceed) {
        this.uiStore.removeContent$(content);
      }
    });
  }


  openTestSelector(): void {
    const catData: TestSelectorData = {
      type: ContentSelectorOpType.OTHER
    };
    this.matDialog.open(TestSelectorComponent, {
      data: catData,
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      role: 'dialog'
    });
  }

  openQuestionnaireSelector(): void {
    const data: QuestionnaireSelectorData = {
      type: ContentSelectorOpType.OTHER
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

  openTestGroupSelector(): void {
    const data: TestGroupSelectorData = {
      type: ContentSelectorOpType.OTHER
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

  ngOnDestroy(): void {
    this.restoreSelectedState();
  }

  submit(): void {
    this.assessmentGroup.markAllAsDirty();
    this.assessmentGroup.markAllAsTouched();
    if (this.assessmentGroup.invalid) {
      this.hotToastService.error(this.formValidationService.formSubmitError);
      return;
    }
    this.store.updateAssessment$(this.assessmentGroup.value);
  }

  assessmentDragEvent($event: CdkDragDrop<ContentCore>): void {
    const selectedContent = this.selectedContents ? [...this.selectedContents] : [];
    moveItemInArray(selectedContent, $event.previousIndex, $event.currentIndex);
    this.uiStore.patchState({
      selectedContent
    });
  }
}
