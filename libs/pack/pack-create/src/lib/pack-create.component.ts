import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LessonCreateComponent } from '@hidden-innovation/shared/ui/lesson-create';
import { Lesson, LessonCore, Pack, PackCore, PackStore } from '@hidden-innovation/pack/data-access';
import { TestSelectorComponent } from '@hidden-innovation/shared/ui/test-selector';
import { TestGroupSelectorComponent } from '@hidden-innovation/shared/ui/test-group-selector';
import { QuestionnaireSelectorComponent } from '@hidden-innovation/shared/ui/questionnaire-selector';
import { TestGroup, TestGroupCore } from '@hidden-innovation/test-group/data-access';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { Test } from '@hidden-innovation/test/data-access';
import { QuestionnaireExtended } from '@hidden-innovation/questionnaire/data-access';
import { UiStore } from '@hidden-innovation/shared/store';
import { AspectRatio } from '@hidden-innovation/media';

export interface LessonDialogReq {
  isNew: boolean;
}

@Component({
  selector: 'hidden-innovation-pack-create',
  templateUrl: './pack-create.component.html',
  styleUrls: ['./pack-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackCreateComponent implements OnInit, OnDestroy {

  packForm: FormGroup<PackCore> = new FormGroup<PackCore>({
    name: new FormControl<string>('', [
      ...this.formValidationService.nameValidations
    ]),
    description: new FormControl<string>('', [
      ...this.formValidationService.requiredFieldValidation
    ]),
    isPublished: new FormControl<boolean>(false),
    posterId: new FormControl<number>(undefined, [
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]),
    thumbnailId: new FormControl<number>(undefined, [
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]),
    urls: new FormArray<string>([]),
    lessons: new FormControl<LessonCore[]>([]),
    questionnaireIds: new FormArray<number>([]),
    testIds: new FormArray<number>([]),
    testGroupIds: new FormArray<number>([])
  });

  selectedTests: Test[] = [];
  selectedQuestionnaires: QuestionnaireExtended[] = [];
  selectedTestGroups: TestGroup[] = [];
  selectedLessons: Lesson[] = [];

  aspectRatio = AspectRatio;

  constructor(
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public constantDataService: ConstantDataService,
    public formValidationService: FormValidationService,
    public store: PackStore,
    private fb: FormBuilder,
    public uiStore: UiStore
  ) {
    const { testIds, testGroupIds, questionnaireIds, lessons } = this.packForm.controls;
    const testFromArray: FormArray<number> = testIds as FormArray<number>;
    const testGroupFromArray: FormArray<number> = testGroupIds as FormArray<number>;
    const questionnaireFromArray: FormArray<number> = questionnaireIds as FormArray<number>;
    // Store methods
    const { selectedTests$, selectedQuestionnaires$, selectedTestGroups$, selectedLessons$ } = this.uiStore;
    selectedTests$.subscribe(newTests => {
      this.selectedTests = newTests;
      testFromArray.clear();
      newTests.forEach(t => {
        testFromArray.push(this.buildTestForm(t));
        testFromArray.updateValueAndValidity();
      });
    });
    selectedTestGroups$.subscribe(newTG => {
      this.selectedTestGroups = newTG;
      testGroupFromArray.clear();
      newTG.forEach(tg => {
        testGroupFromArray.push(this.buildTestGroupForm(tg));
        testGroupFromArray.updateValueAndValidity();
      });
    });
    selectedQuestionnaires$.subscribe(questionnaires => {
      this.selectedQuestionnaires = questionnaires;
      questionnaireFromArray.clear();
      questionnaires.forEach(q => {
        questionnaireFromArray.push(this.buildQuestionnaireForm(q));
        questionnaireFromArray.updateValueAndValidity();
      });
    });
    selectedLessons$.subscribe(newLessons => {
      this.selectedLessons = newLessons;
      questionnaireFromArray.clear();
      lessons.setValue(newLessons ?? []);
    });
  }

  get lessonFormArray(): FormArray<LessonCore> {
    return this.packForm.controls.lessons as FormArray<LessonCore>;
  }

  ngOnInit(): void {
  }

  buildTestForm(test: Test): FormControl<number> {
    return this.fb.control<number>(test.id, [...this.formValidationService.requiredFieldValidation]);
  }

  buildTestGroupForm(tg: TestGroup): FormControl<number> {
    return this.fb.control<number>(tg.id, [...this.formValidationService.requiredFieldValidation]);
  }

  buildQuestionnaireForm(q: QuestionnaireExtended): FormControl<number> {
    return this.fb.control<number>(q.id, [...this.formValidationService.requiredFieldValidation]);
  }

  openCreateLessonDialog(): void {
    const lessonCreateReqObj: LessonDialogReq = {
      isNew: true
    };
    const dialogRef = this.matDialog.open(LessonCreateComponent, {
      data: lessonCreateReqObj,
      minWidth: '25rem'
    });
    dialogRef.afterClosed().subscribe((pack: Pack[]) => {
      if (pack) {
        return;
      }
    });
  }

  trackTestByFn(index: number, test: Test): number {
    return test.id;
  }

  trackTestGroupByFn(index: number, tg: TestGroup): number {
    return tg.id;
  }

  trackQuestionnaireGroupByFn(index: number, q: QuestionnaireExtended): number {
    return q.id;
  }

  trackLessonGroupByFn(index: number, lesson: Lesson): number {
    return lesson.id;
  }

  deleteSelectedTest(test: Test): void {
    if (this.selectedTests.find(value => value.id === test.id)) {
      this.uiStore.patchState({
        selectedTests: [
          ...this.selectedTests.filter(t => t.id !== test.id)
        ]
      });
    }
  }

  deleteSelectedTestGroup(tg: TestGroup): void {
    if (this.selectedTestGroups.find(value => value.id === tg.id)) {
      this.uiStore.patchState({
        selectedTestGroups: [
          ...this.selectedTestGroups.filter(t => t.id !== tg.id)
        ]
      });
    }
  }

  deleteSelectedQuestionnaire(q: QuestionnaireExtended): void {
    if (this.selectedQuestionnaires.find(value => value.id === q.id)) {
      this.uiStore.patchState({
        selectedQuestionnaires: [
          ...this.selectedQuestionnaires.filter(t => t.id !== q.id)
        ]
      });
    }
  }

  deleteSelectedLesson(lesson: Lesson): void {
    if (this.selectedLessons.find(value => value.id === lesson.id)) {
      this.uiStore.patchState({
        selectedLessons: [
          ...this.selectedLessons.filter(l => l.id !== lesson.id)
        ]
      });
    }
  }

  openTestGroupDialog(): void {
    const dialogRef = this.matDialog.open(TestGroupSelectorComponent, {
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      role: 'dialog'
    });
    dialogRef.afterClosed().subscribe((pack: Pack[] | undefined) => {
      if (pack) {
        return;
      }
    });
  }

  openTestSelector(): void {
    const dialogRef = this.matDialog.open(TestSelectorComponent, {
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      role: 'dialog'
    });
    dialogRef.afterClosed().subscribe((tests: TestGroupCore[] | undefined) => {
      if (tests) {
        return;
      }
    });
  }

  openQuestionnaireDialog(): void {
    const dialogRef = this.matDialog.open(QuestionnaireSelectorComponent, {
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      role: 'dialog'
    });
    // dialogRef.afterClosed().subscribe((questions: Questionnaire[] | undefined) => {
    // });
  }

  ngOnDestroy(): void {
    this.uiStore.patchState({
      selectedLessons: undefined,
      selectedQuestionnaires: undefined,
      selectedTests: undefined,
      selectedTestGroups: undefined
    });
  }

  submit() {
    this.packForm.markAllAsTouched();
    this.packForm.markAllAsDirty();
  }
}
