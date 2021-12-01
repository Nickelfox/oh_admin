import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { TagCore, TagDialogReq, TagsStore } from '@hidden-innovation/tags/data-access';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { TagCategoryEnum, TagTypeEnum } from '@hidden-innovation/shared/models';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'hidden-innovation-tag-create',
  templateUrl: './tag-create.component.html',
  styleUrls: ['./tag-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagCreateComponent {

  tagCategoryEnum = Object.values(TagCategoryEnum);
  tagTypeEnum = TagTypeEnum;

  tagForm: FormGroup<TagCore> = new FormGroup<TagCore>({
    name: new FormControl<string>('', [
      RxwebValidators.required(),
      RxwebValidators.notEmpty(),
      RxwebValidators.alphaNumeric({
        allowWhiteSpace: true
      }),
      RxwebValidators.maxLength({
        value: this.formValidationService.FIELD_VALIDATION_VALUES.NAME_LENGTH
      })
    ]),
    tagType: new FormControl<TagTypeEnum>(TagTypeEnum.EXERCISE, [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    categoryName: new FormControl<TagCategoryEnum | null>(null)
  });

  constructor(
    public dialogRef: MatDialogRef<TagCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TagDialogReq,
    public formValidationService: FormValidationService,
    public constantDataService: ConstantDataService,
    public store: TagsStore,
    private hotToastService: HotToastService
  ) {
    const { tag, tagType, isNew } = data;
    if (tagType === TagTypeEnum.SUB_CATEGORY) {
      this.tagForm.controls.categoryName.setValidators([
        RxwebValidators.required(),
        RxwebValidators.notEmpty()
      ]);
    }
    if (isNew) {
      this.tagForm.patchValue({
        tagType
      });
      return;
    }
    if (!tag) {
      this.hotToastService.error('Application Error! Missing/Invalid Tag data');
      this.dialogRef.close();
      return;
    }
    this.tagForm.patchValue({
      tagType,
      name: tag.name,
      categoryName: tag.categoryName
    });
  }

  submitTag(): void {
    this.tagForm.markAllAsDirty();
    this.tagForm.markAllAsTouched();
    if (this.tagForm.invalid) {
      return;
    }
    this.dialogRef.close(this.tagForm.value);
  }

}
