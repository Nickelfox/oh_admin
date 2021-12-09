import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { MatDialogRef } from '@angular/material/dialog';
import { PackCore } from '@hidden-innovation/pack/data-access';
import { MatTableDataSource } from '@angular/material/table';
import { TestCore } from '@hidden-innovation/test/data-access';

import { SelectionModel } from '@angular/cdk/collections';
import { TestGroup } from '@hidden-innovation/test-group/data-access';
import { PublishStatusEnum, StatusChipType, TagCategoryEnum } from '@hidden-innovation/shared/models';
import { DateTime } from 'luxon';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const dummyTestGroup: TestGroup[] = [{
  id: 0,
  name: 'Long Run',
  category: TagCategoryEnum.CARDIO,
  created_at: DateTime.now().toISODate(),
  deleted_at: DateTime.now().toISODate(),
  updated_at: DateTime.now().toISODate(),
  status: true,
  options: 3
}, {
  id: 1,
  name: 'Short Sprint',
  category: TagCategoryEnum.CARDIO,
  created_at: DateTime.now().toISODate(),
  deleted_at: DateTime.now().toISODate(),
  updated_at: DateTime.now().toISODate(),
  status: true,
  options: 5
}, {
  id: 2,
  name: 'Breath Hold',
  category: TagCategoryEnum.STRENGTH,
  created_at: DateTime.now().toISODate(),
  deleted_at: DateTime.now().toISODate(),
  updated_at: DateTime.now().toISODate(),
  status: true,
  options: 4
}];

@Component({
  selector: 'hidden-innovation-test-group-selector',
  templateUrl: './test-group-selector.component.html',
  styleUrls: ['./test-group-selector.component.sass'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestGroupSelectorComponent implements OnInit {
  displayedColumns: string[] = ['select','id', 'name', 'updated_at', 'category', 'options', 'status', 'action'];

  testGroup: MatTableDataSource<TestGroup> = new MatTableDataSource<TestGroup>([]);
  selection = new SelectionModel<TestCore>(true, []);
  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  noData: Observable<boolean>;

  publishStatusEnum = PublishStatusEnum;
  statusChipType = StatusChipType;

  constructor(
    public constantDataService: ConstantDataService,
    public matDialogRef: MatDialogRef<PackCore[]>
  ) {
    this.noData = this.testGroup.connect().pipe(map(data => data.length === 0));
    this.testGroup = new MatTableDataSource<TestGroup>(dummyTestGroup);
  }

  ngOnInit(): void {
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.testGroup.data.length;
    return numSelected === numRows;
  }


  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    // @ts-ignore
    this.selection.select(...this.testGroup.data);
  }

}
