import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {PageEvent} from "@angular/material/paginator";
import {PublishStatusEnum, SortingEnum, StatusChipType, TagCategoryEnum} from "@hidden-innovation/shared/models";
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import {DateTime} from "luxon";
import {Test, TestListingFilters} from "@hidden-innovation/test/data-access";
import {PackCore} from "@hidden-innovation/pack/data-access";
import {FormControl, FormGroup} from "@ngneat/reactive-forms";

export enum PackType  {
  CARDIO = 'CARDIO',
  LIFESTYLE = 'LIFESTYLE',
  FUNCTION = 'FUNCTION',
  MOVEMENT = 'MOVEMENT',
  STRENGTH = 'STRENGTH'
}


export const dummyPack = [
  {
    name:'Pack 1',
    category: PackType.CARDIO,
    updated_at: DateTime.now().toISODate(),
  },
  {
    name:'Pack 2',
    category: PackType.LIFESTYLE,
    updated_at: DateTime.now().toISODate(),
  },
  {
    name:'Pack 3',
    category: PackType.STRENGTH,
    updated_at: DateTime.now().toISODate(),
  },
  {
    name:'Pack 4',
    category: PackType.FUNCTION,
    updated_at: DateTime.now().toISODate(),
  },
  {
    name:'Pack 5',
    category: PackType.MOVEMENT,
    updated_at: DateTime.now().toISODate(),
  },
]

@Component({
  selector: 'hidden-innovation-pack-selector',
  templateUrl: './pack-selector.component.html',
  styleUrls: ['./pack-selector.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackSelectorComponent implements OnInit {

  displayedColumns: string[] = ['select', 'name','category', 'updated_at'];
  packSelector: MatTableDataSource<any> = new MatTableDataSource();

  filters: FormGroup<TestListingFilters> = new FormGroup<TestListingFilters>({
    type: new FormControl(undefined),
    category: new FormControl(undefined),
    dateSort: new FormControl(SortingEnum.DESC),
    nameSort: new FormControl({ value: undefined, disabled: true }),
    search: new FormControl(undefined),
    level: new FormControl(undefined),
    published: new FormControl(undefined)
  });

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  statusChipType = StatusChipType;
  publishStatusEnum = PublishStatusEnum;
  sortingEnum = SortingEnum;


  tagCategoryIte = Object.values(TagCategoryEnum);

  constructor(
    public constantDataService: ConstantDataService,
  ) {
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }



  ngOnInit(): void {
    this.packSelector = new MatTableDataSource(dummyPack);
    console.log(dummyPack);
  }





}
