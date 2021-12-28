import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LessonCreateComponent } from '@hidden-innovation/shared/ui/lesson-create';
import {
  Content,
  ContentCore,
  ContentUrl,
  Lesson,
  LessonCore,
  Pack,
  PackCore,
  PackStore
} from '@hidden-innovation/pack/data-access';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { UiStore } from '@hidden-innovation/shared/store';
import { AspectRatio, Media } from '@hidden-innovation/media';
import { UntilDestroy } from '@ngneat/until-destroy';
import { filter, switchMap, tap } from 'rxjs/operators';
import { OperationTypeEnum, PackContentTypeEnum } from '@hidden-innovation/shared/models';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ContentSelectorComponent } from '@hidden-innovation/shared/ui/content-selector';
import { UpperCasePipe } from '@angular/common';

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
      ...this.formValidationService.requiredFieldValidation,
      RxwebValidators.maxLength({
        value: this.formValidationService.FIELD_VALIDATION_VALUES.NAME_LENGTH
      })
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
    urls: new FormArray<ContentUrl>([]),
    content: new FormControl<ContentCore[] | LessonCore[]>([]),
    imagesAndPdfsIds: new FormArray<number>([])
  });

  aspectRatio = AspectRatio;
  opType?: OperationTypeEnum;
  selectedPack?: Pack;
  private packID?: number;
  private selectedContents: ContentCore[] | LessonCore[] = [];

  constructor(
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public constantDataService: ConstantDataService,
    public formValidationService: FormValidationService,
    public store: PackStore,
    private fb: FormBuilder,
    public uiStore: UiStore,
    private hotToastService: HotToastService,
    private route: ActivatedRoute,
    private upperCasePipe: UpperCasePipe
  ) {
    this.route.data.pipe(
      filter(data => data?.type !== undefined),
      tap((data) => {
        this.opType = data.type as OperationTypeEnum;
      }),
      switchMap(_ => this.route.params)
    ).subscribe((res) => {
      if (this.opType === OperationTypeEnum.EDIT) {
        this.restoreSelectedState();
        this.packID = res['id'];
        if (!this.packID) {
          this.hotToastService.error('Error occurred while fetching details');
          return;
        }
        this.store.getPackDetails$({
          id: this.packID
        });
        this.store.selectedPack$.subscribe((pack) => {
          if (pack) {
            this.populatePack(pack);
          }
        });
      }
    });
    this.uiStore.selectedContent$.subscribe((contents) => {
      this.selectedContents = contents.map((c, i) => {
        return {
          ...c,
          order: i + 1
        };
      });
      this.contentArrayCtrl.setValue(this.selectedContents);
      this.packForm.updateValueAndValidity();
      this.cdr.markForCheck();
    });
    const { isPublished, content } = this.packForm.controls;
    content.valueChanges.subscribe(_ => {
      this.contentIsValid ? isPublished.setValue(true) : isPublished.setValue(false);
      this.packForm.updateValueAndValidity();
      this.cdr.markForCheck();
    });
  }

  get contentIsValid(): boolean {
    return this.packForm.controls.content.value?.length >= 2;
  }

  get contentArrayCtrl(): FormControl<ContentCore[] | LessonCore[]> {
    return this.packForm.controls.content as FormControl<ContentCore[] | LessonCore[]>;
  }

  get contentArrayExists(): boolean {
    return this.contentArrayCtrl.value?.length > 0;
  }

  get urlFormArray(): FormArray<ContentUrl> {
    return this.packForm.controls.urls as FormArray<ContentUrl>;
  }

  get imagesAndPdfsArrayCtrl(): FormArray<number> {
    return this.packForm.controls.imagesAndPdfsIds as FormArray<number>;
  }

  restoreSelectedState(): void {
    this.uiStore.patchState({
      selectedContent: []
    });
    this.store.patchState({
      selectedPack: undefined
    });
  }

  buildResourceFormCtrl(id?: number): FormControl<number> {
    return new FormControl<number>(id ?? undefined, [
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]);
  }

  addResourceCtrl(id?: number): void {
    this.imagesAndPdfsArrayCtrl.push(this.buildResourceFormCtrl(id));
  }

  deleteResourceCtrl(index: number): void {
    this.imagesAndPdfsArrayCtrl.removeAt(index);
  }

  deleteSelectedContent(content: ContentCore | LessonCore): void {
    const selectedContent = this.selectedContents.find(value => value.content_id === content.content_id && value.type === content.type);
    if (selectedContent) {
      this.uiStore.patchState({
        selectedContent: [
          ...this.selectedContents.filter(c => c.content_id !== content.content_id || c.type !== content.type)
        ]
      });
    }
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
        this.uiStore.patchState({
          selectedContent: [
            ...this.selectedContents,
            newLesson
          ]
        });
      }
    });
  }

  addUrlCtrl(urlObj?: ContentUrl): void {
    this.urlFormArray.push(new FormGroup<ContentUrl>({
      url: new FormControl<string>(urlObj?.url ?? '', [
        ...this.formValidationService.requiredFieldValidation,
        RxwebValidators.url()
      ]),
      description: new FormControl<string>(urlObj?.description ?? '', [
        ...this.formValidationService.requiredFieldValidation,
        RxwebValidators.maxLength({
          value: this.formValidationService.FIELD_VALIDATION_VALUES.NAME_LENGTH
        })
      ])
    }));
  }

  urlFormControl(i: number): FormGroup<ContentUrl> {
    return this.urlFormArray.controls[i] as FormGroup<ContentUrl>;
  }

  removeUrlCtrl(i: number): void {
    this.urlFormArray.removeAt(i);
  }

  ngOnDestroy(): void {
    this.restoreSelectedState();
  }

  submit() {
    this.packForm.markAllAsTouched();
    this.packForm.markAllAsDirty();
    if (this.packForm.invalid) {
      this.hotToastService.error(this.formValidationService.formSubmitError);
      return;
    }
    const packObject: PackCore = {
      ...this.packForm.value,
      content: this.packForm.value.content.map(c => {
        return {
          ...c,
          type: this.upperCasePipe.transform(c.type) as PackContentTypeEnum
        };
      })
    };
    if (this.opType === OperationTypeEnum.CREATE) {
      this.store.createPack$(packObject);
    } else if (this.opType === OperationTypeEnum.EDIT) {
      if (!this.packID) {
        this.hotToastService.error('Error occurred while submitting details');
        return;
      }
      this.store.updatePack$({
        id: this.packID,
        pack: packObject
      });
    }
  }

  selectedResource(i: number): Media | undefined {
    return this.selectedPack?.imagesAndPdfs[i];
  }

  private populatePack(pack: Pack): void {
    const { name, description, thumbnailId, posterId } = pack;
    this.selectedPack = pack;
    const selectedContent: Content[] | Lesson[] = (this.selectedPack.content as (Content[] | Lesson[])) ?? [];
    const resources: Media[] = this.selectedPack.imagesAndPdfs as Media[];
    const urls: ContentUrl[] = this.selectedPack.urls as ContentUrl[];
    this.packForm.patchValue({
      name,
      description,
      thumbnailId,
      posterId
    });
    urls.forEach(u => this.addUrlCtrl(u));
    resources.forEach(r => this.addResourceCtrl(r.id));
    this.uiStore.patchState({
      selectedContent: [
        ...selectedContent.map((c) => {
          if (c.type === PackContentTypeEnum.LESSON) {
            const contentLesson: Lesson = c as Lesson;
            return {
              content_id: contentLesson.contentId,
              type: contentLesson.type,
              name: contentLesson.name,
              tagIds: contentLesson.tagIds,
              category: contentLesson.category,
              videoId: contentLesson.videoId,
              thumbnailId: contentLesson.thumbnailId
            } as LessonCore;
          } else {
            return {
              content_id: c.contentId,
              type: c.type,
              name: c.name
            } as ContentCore;
          }
        })
      ]
    });
    this.cdr.markForCheck();
  }
}
