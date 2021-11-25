import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@ngneat/reactive-forms';
import { TestInputTypeEnum } from '@hidden-innovation/shared/models';
import { TagsStore } from '@hidden-innovation/tags/data-access';

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
  filteredTags: Observable<string[]>;
  tags: string[] = ['Nutrition'];
  allTags: string[] = ['Muscular Strength', 'Nutrition'];

  testInputTypeEnum = TestInputTypeEnum;

  testInputTypeIte = Object.values(TestInputTypeEnum).map(value => value.toString());

  @ViewChild('tagsInput') tagsInput?: ElementRef<HTMLInputElement>;

  constructor(
    public tagStore: TagsStore,
  ) {
    this.filteredTags = this.tagsCtrl.valueChanges.pipe(
      startWith(null),
      map((tags: string | null) => (tags ? this._filter(tags) : this.allTags.slice())),
    );
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our Tag
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    // event?.chipInput!.clear();

    this.tagsCtrl.setValue(null);
  }

  remove(tags: string): void {
    const index = this.tags.indexOf(tags);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    if(this.tagsInput)
    {
      this.tagsInput.nativeElement.value = '';
    }

    this.tagsCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tags => tags.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
  }

}
