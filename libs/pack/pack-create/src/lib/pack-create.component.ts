import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
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
import { filter, mergeMap, tap } from 'rxjs/operators';
import {
  ContentSelectorOpType,
  GenericDialogPrompt,
  OperationTypeEnum,
  PackContentTypeEnum
} from '@hidden-innovation/shared/models';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TitleCasePipe } from '@angular/common';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';
import { TestSelectorComponent, TestSelectorData } from '@hidden-innovation/shared/ui/test-selector';
import { TestGroupSelectorComponent, TestGroupSelectorData } from '@hidden-innovation/shared/ui/test-group-selector';
import {
  QuestionnaireSelectorComponent,
  QuestionnaireSelectorData
} from '@hidden-innovation/shared/ui/questionnaire-selector';
import { ComponentCanDeactivate } from '@hidden-innovation/shared/utils';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-pack-create',
  templateUrl: './pack-create.component.html',
  styleUrls: ['./pack-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackCreateComponent implements OnDestroy, ComponentCanDeactivate {

  packForm: FormGroup<PackCore> = new FormGroup<PackCore>({
    name: new FormControl<string>('', [
      ...this.formValidationService.requiredFieldValidation,
      RxwebValidators.maxLength({
        value: this.formValidationService.FIELD_VALIDATION_VALUES.PACK_NAME_LENGTH
      })
    ]),
    description: new FormControl<string>('', [
      ...this.formValidationService.requiredFieldValidation
    ]),
    subTitle: new FormControl<string>('', [
      ...this.formValidationService.requiredFieldValidation,
      RxwebValidators.maxLength({
        value: this.formValidationService.FIELD_VALIDATION_VALUES.SUB_TITLE_LENGTH
      })
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
  loaded = false;
  private packID?: number;

  constructor(
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public constantDataService: ConstantDataService,
    public formValidationService: FormValidationService,
    public store: PackStore,
    private fb: FormBuilder,
    public uiStore: UiStore,
    private titleCasePipe: TitleCasePipe,
    private hotToastService: HotToastService,
    private route: ActivatedRoute
  ) {
    this.route.data.pipe(
      filter(data => data?.type !== undefined),
      tap((data) => {
        this.opType = data.type as OperationTypeEnum;
      }),
      mergeMap(_ => this.route.params)
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
    const { content } = this.packForm.controls;
    content.valueChanges.subscribe(_ => {
      this.packForm.updateValueAndValidity();
      this.cdr.markForCheck();
    });
    this.store.loaded$.pipe(
      tap(res => this.loaded = res)
    ).subscribe();
  }

  private _selectedContents: ContentCore[] | LessonCore[] = [];

  get selectedContents(): (ContentCore | LessonCore)[] {
    return this._selectedContents ?? [];
  }

  set selectedContents(content) {
    this._selectedContents = content ?? [];
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
      selectedContent: [],
      selectedQuestionnaires: [],
      selectedTests: [],
      selectedTestGroups: [],
      selectedLessons: []
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

  deleteSelectedContentPrompt(content: ContentCore | LessonCore): void {
    const contentType: string = content.type === PackContentTypeEnum.SINGLE ? 'TEST SINGLE' : content.type;
    const dialogData: GenericDialogPrompt = {
      title: `Remove ${contentType}?`,
      desc: `Are you sure you want to remove this ${this.titleCasePipe.transform(contentType)} from Pack?`,
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

  openCreateLessonDialog(): void {
    const dialogRef = this.matDialog.open(LessonCreateComponent, {
      minWidth: '25rem',
      disableClose: true
      // hasBackdrop:false
    });
    dialogRef.afterClosed().subscribe((lesson: LessonCore) => {
      if (lesson) {
        this.uiStore.patchState({
          selectedContent: [
            ...this.selectedContents,
            lesson as LessonCore
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
    if (this.opType === OperationTypeEnum.CREATE) {
      this.store.createPack$(this.packForm.value);
    } else if (this.opType === OperationTypeEnum.EDIT) {
      if (!this.packID) {
        this.hotToastService.error('Error occurred while submitting details');
        return;
      }
      this.store.updatePack$({
        id: this.packID,
        pack: this.packForm.value
      });
    }
  }

  selectedResource(i: number): Media | undefined {
    try {
      return this.selectedPack?.imagesAndPdfs[i];
    } catch {
      return;
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return this.packForm.dirty ? this.loaded : true;
  }

  packDragEvent($event: CdkDragDrop<(ContentCore | LessonCore)[]>) {
    const selectedContent = this.selectedContents ? [...this.selectedContents] : [];
    moveItemInArray(selectedContent, $event.previousIndex, $event.currentIndex);
    this.uiStore.patchState({
      selectedContent
    });
  }

  private populatePack(pack: Pack): void {
    const { name, description, thumbnailId, posterId, subTitle } = pack;
    this.selectedPack = pack;
    const selectedContent: Content[] | Lesson[] = (this.selectedPack.content as (Content[] | Lesson[])) ?? [];
    const resources: Media[] = this.selectedPack.imagesAndPdfs as Media[] ?? [];
    const urls: ContentUrl[] = this.selectedPack.urls as ContentUrl[] ?? [];
    this.packForm.patchValue({
      name,
      description,
      thumbnailId,
      posterId,
      subTitle
    });
    urls.forEach(u => this.addUrlCtrl(u));
    resources.forEach(r => this.addResourceCtrl(r.id));
    this.uiStore.patchState({
      selectedContent: [
        ...selectedContent.map((c) => {
          if (c.type === PackContentTypeEnum.LESSON) {
            const contentLesson: Lesson = c as Lesson;
            return {
              contentId: contentLesson.contentId,
              type: contentLesson.type,
              name: contentLesson.name,
              tagIds: contentLesson.tagIds,
              category: contentLesson.category,
              videoId: contentLesson.videoId,
              thumbnailId: contentLesson.thumbnailId
            } as LessonCore;
          } else {
            return {
              contentId: c.contentId,
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
