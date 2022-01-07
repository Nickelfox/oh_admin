import { ChangeDetectionStrategy, Component, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Lesson, LessonCore } from '@hidden-innovation/pack/data-access';
import { PackContentTypeEnum, TagCategoryEnum, TagTypeEnum } from '@hidden-innovation/shared/models';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { AspectRatio } from '@hidden-innovation/media';
import { Tag } from '@hidden-innovation/tags/data-access';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-lesson-create',
  templateUrl: './lesson-create.component.html',
  styleUrls: ['./lesson-create.component.sass'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonCreateComponent implements OnDestroy {

  testTags: Tag[] = [];

  testCatTypeIte = Object.values(TagCategoryEnum).map(value => value.toString());

  aspectRatio = AspectRatio;

  tagTypeEnum = TagTypeEnum;

  lessonFrom: FormGroup<LessonCore> = new FormGroup<LessonCore>({
    name: new FormControl<string>('', [
      ...this.formValidationService.requiredFieldValidation,
      RxwebValidators.minLength({
        value: 1
      }),
      RxwebValidators.maxLength({
        value: this.formValidationService.FIELD_VALIDATION_VALUES.NAME_LENGTH
      })
    ]),
    category: new FormControl<TagCategoryEnum | 'NONE'>('NONE', [
      ...this.formValidationService.requiredFieldValidation
    ]),
    videoId: new FormControl<number>(undefined, [
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
    tagIds: new FormControl<number[]>([]),
    type: new FormControl<PackContentTypeEnum>(PackContentTypeEnum.LESSON),
    order: new FormControl<number>(undefined),
    contentId: new FormControl<number | null>(null)
  });

  existingLesson?: Lesson;

  constructor(
    public formValidationService: FormValidationService,
    public dialogRef: MatDialogRef<LessonCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Lesson,
    public constantDataService: ConstantDataService,
    private hotToastService: HotToastService
  ) {
    const { category } = this.lessonFrom.controls;
    category.valueChanges.subscribe(_ => {
      this.testTags = [];
      this.updateTagControl();
    });
    if (data) {
      this.existingLesson = data;
      const { name, category, thumbnailId, videoId, tagIds } = data;
      this.lessonFrom.patchValue({
        name,
        category,
        thumbnailId,
        videoId
      });
      const tags: Tag[] = tagIds as Tag[];
      tags?.forEach(t => this.updateTestTags(t));
    }
  }

  ngOnDestroy(): void {
    this.testTags = [];
  }

  removeTag(tag: Tag): void {
    if (this.testTags.includes(tag)) {
      this.testTags = [
        ...this.testTags.filter(t => t.id !== tag.id)
      ];
      this.updateTagControl();
    }
  }

  updateTestTags(newTag: Tag) {
    this.testTags = [
      ...this.testTags,
      newTag
    ];
    this.updateTagControl();
  }

  updateTagControl(): void {
    this.lessonFrom.controls.tagIds.setValue(
      [...this.testTags.map(t => t.id)]
    );
  }

  submitLesson(): void {
    this.lessonFrom.markAllAsDirty();
    this.lessonFrom.markAllAsTouched();
    if (this.lessonFrom.invalid) {
      this.hotToastService.error(this.formValidationService.formSubmitError);
      return;
    }
    this.dialogRef.close(this.lessonFrom.value);
  }
}
