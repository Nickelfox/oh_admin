import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LessonCreateComponent } from '@hidden-innovation/shared/ui/lesson-create';
import { ContentCore, LessonCore, PackCore, PackStore } from '@hidden-innovation/pack/data-access';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { UiStore } from '@hidden-innovation/shared/store';
import { AspectRatio } from '@hidden-innovation/media';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ContentSelectorComponent } from '../../../../shared/ui/content-selector/src/lib/content-selector.component';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-pack-create',
  templateUrl: './pack-create.component.html',
  styleUrls: ['./pack-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackCreateComponent implements OnDestroy {

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
    content: new FormControl<ContentCore[] | LessonCore[]>([]),
    imagesAndPdfsIds: new FormArray<number>([])
  });

  selectedList: ContentCore[] | LessonCore[] = [];

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
  }

  get contentArrayCtrl(): FormControl<ContentCore[] | LessonCore[]> {
    return this.packForm.controls.content as FormControl<ContentCore[] | LessonCore[]>;
  }

  get contentArrayExists(): boolean {
    return this.contentArrayCtrl.value?.length > 0;
  }

  get urlFormArray(): FormArray<string> {
    return this.packForm.controls.urls as FormArray<string>;
  }

  get imagesAndPdfsArrayCtrl(): FormArray<number> {
    return this.packForm.controls.imagesAndPdfsIds as FormArray<number>;
  }

  get imagesAndPdfsArrayCtrlExists(): boolean {
    return this.imagesAndPdfsArrayCtrl.value?.length > 0;
  }

  buildResourceFormCtrl(): FormControl<number> {
    return new FormControl<number>(undefined, [
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]);
  }

  addResourceCtrl(): void {
    this.imagesAndPdfsArrayCtrl.push(this.buildResourceFormCtrl());
  }

  deleteResourceCtrl(index: number): void {
    this.imagesAndPdfsArrayCtrl.removeAt(index);
  }

  deleteSelectedContent(contentIndex: number): void {
    this.contentArrayCtrl.setValue([
      ...this.contentArrayCtrl.value.filter((c, i) => contentIndex !== i)
    ]);
  }

  openContentSelectorDialog(): void {
    this.matDialog.open(ContentSelectorComponent, {
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      role: 'dialog'
    });
    // testGroupDialog.afterClosed().subscribe((tgs: TestGroup[] | undefined) => {
    // });
  }

  openCreateLessonDialog(): void {
    const dialogRef = this.matDialog.open(LessonCreateComponent, {
      minWidth: '25rem'
    });
    dialogRef.afterClosed().subscribe((lesson: LessonCore) => {
      if (lesson) {
        const newLesson: LessonCore = lesson as LessonCore;
        this.contentArrayCtrl.setValue([
          ...this.contentArrayCtrl.value,
          {
            ...newLesson,
            order: this.contentArrayCtrl.value.length + 1
          }
        ]);
      }
    });
  }

  addUrlCtrl(): void {
    this.urlFormArray.push(new FormControl<string>('', [
      ...this.formValidationService.requiredFieldValidation,
      RxwebValidators.url()
    ]));
  }

  removeUrlCtrl(i: number): void {
    this.urlFormArray.removeAt(i);
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
