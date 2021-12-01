import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TestCore } from '@hidden-innovation/test/data-access';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import {
  DifficultyEnum,
  PublishStatusEnum,
  StatusChipType,
  TagCategoryEnum,
  TestInputTypeEnum
} from '@hidden-innovation/shared/models';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { map } from 'rxjs/operators';
import { dummyTests } from '@hidden-innovation/test/test-listing';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'hidden-innovation-test-selector',
  templateUrl: './test-selector.component.html',
  styleUrls: ['./test-selector.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestSelectorComponent implements OnInit {

  displayedColumns: string[] = ['select', 'id', 'name', 'updated_at', 'category', 'difficulty', 'input', 'status'];
  tests: MatTableDataSource<TestCore> = new MatTableDataSource<TestCore>();

  selection = new SelectionModel<TestCore>(true, []);

  noData: Observable<boolean>;

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  statusChipType = StatusChipType;
  publishStatusEnum = PublishStatusEnum;

  tagCategoryIte = Object.values(TagCategoryEnum);
  difficultyIte = Object.values(DifficultyEnum);
  testInputTypeIte = Object.values(TestInputTypeEnum);

  constructor(
    public constantDataService: ConstantDataService,
    public matDialogRef: MatDialogRef<TestCore[]>
  ) {
    this.noData = this.tests.connect().pipe(map(data => data.length === 0));
    this.tests = new MatTableDataSource<TestCore>(dummyTests);
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  ngOnInit(): void {
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tests.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.tests.data);
  }

}
