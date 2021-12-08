import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { DifficultyEnum, TagCategoryEnum, TagTypeEnum, TestInputTypeEnum } from '@hidden-innovation/shared/models';
import { Tag, TagsStore } from '@hidden-innovation/tags/data-access';
import { paginatorData } from '@hidden-innovation/user/data-access';
import { CreateTest } from '@hidden-innovation/test/data-access';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'hidden-innovation-test-create',
  templateUrl: './test-create.component.html',
  styleUrls: ['./test-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestCreateComponent implements OnInit {
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  tags: string[] = [];

  subCtrl: FormControl<Tag[]> = new FormControl<Tag[]>([]);
  exerCtrl: FormControl<Tag[]> = new FormControl<Tag[]>([]);

  testInputTypeEnum = TestInputTypeEnum;
  tagTypeEnum = TagTypeEnum;

  testInputTypeIte = Object.values(TestInputTypeEnum).map(value => value.toString());
  testCatTypeIte = Object.values(TagCategoryEnum).map(value => value.toString());

  @ViewChild('tagsInput') tagsInput?: ElementRef<HTMLInputElement>;

  testGroup: FormGroup<CreateTest> = new FormGroup<CreateTest>({
    name: new FormControl('',[
      RxwebValidators.required(),
      RxwebValidators.notEmpty(),
      RxwebValidators.unique()
    ]),
    category: new FormControl(TagCategoryEnum.STRENGTH),
    videoId: new FormControl(undefined, [
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]),
    thumbnailId: new FormControl(undefined,[
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]),
    posterId: new FormControl(undefined),
    label: new FormControl('', [
      RxwebValidators.required(),
      RxwebValidators.notEmpty(),
      RxwebValidators.unique()
    ]),
    description: new FormControl(''),
    outcomes: new FormControl(''),
    procedure: new FormControl(''),
    needEquipment: new FormControl(false),
    equipment: new FormControl(''),
    tags: new FormControl([]),
    difficulty: new FormControl(DifficultyEnum.BEGINNER),
    inputType: new FormControl(undefined),
    distanceUnit: new FormControl(undefined),
    isPublished: new FormControl(true)
  });


  constructor(
    public tagStore: TagsStore,
    public formValidationService: FormValidationService,
    public constantDataService: ConstantDataService
  ) {
    // this.filteredTags = this.tagsCtrl.valueChanges.pipe(
    //   startWith(null),
    //   map((tags: string | null) => (tags ? this._filter(tags) : this.allTags.slice()))
    // );
  }

  //
  // add(event: MatChipInputEvent): void {
  //   const value = (event.value || '').trim();
  //
  //   // Add our Tag
  //   if (value) {
  //     this.tags.push(value);
  //   }
  //
  //   // Clear the input value
  //   // event?.chipInput!.clear();
  //
  //   this.tagsCtrl.setValue(null);
  // }

  // remove(tags: string): void {
  //   const index = this.tags.indexOf(tags);
  //
  //   if (index >= 0) {
  //     this.tags.splice(index, 1);
  //   }
  // }

  // selected(event: MatAutocompleteSelectedEvent): void {
  //   this.tags.push(event.option.viewValue);
  //   if (this.tagsInput) {
  //     this.tagsInput.nativeElement.value = '';
  //   }
  //
  //   this.tagsCtrl.setValue(null);
  // }

  ngOnInit(): void {
  }

  getTags(cat: TagTypeEnum, search?: string) {
    this.tagStore.getTags$({
      page: paginatorData.pageIndex,
      limit: paginatorData.pageSize,
      type: [cat],
      search: search ?? undefined,
      dateSort: undefined,
      category: [],
      nameSort: undefined
    });
    console.log('asdf');
  }

  test(cat: TagTypeEnum, newTag: Tag) {
    switch (cat) {
      case TagTypeEnum.SUB_CATEGORY:
        this.subCtrl.setValue([
          ...this.subCtrl.value,
          newTag
        ]);
        break;
      case TagTypeEnum.EXERCISE:
        this.exerCtrl.setValue([
          ...this.exerCtrl.value,
          newTag
        ]);
        break;
    }
  }

  isExisitingTag(ctrl: FormControl<Tag[]>, tag: Tag): boolean {
    if (ctrl.value) {
      return !!ctrl.value.find(t => t.id === tag.id);
    } else {
      return false;
    }
  }
}
