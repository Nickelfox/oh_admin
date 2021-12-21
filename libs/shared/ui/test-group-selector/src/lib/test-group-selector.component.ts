import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { MatDialogRef } from '@angular/material/dialog';
import { Pack } from '@hidden-innovation/pack/data-access';
import { MatTableDataSource } from '@angular/material/table';

import { SelectionModel } from '@angular/cdk/collections';
import { TestGroup, TestGroupCore } from '@hidden-innovation/test-group/data-access';
import { PublishStatusEnum, StatusChipType } from '@hidden-innovation/shared/models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'hidden-innovation-test-group-selector',
  templateUrl: './test-group-selector.component.html',
  styleUrls: ['./test-group-selector.component.sass'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestGroupSelectorComponent implements OnInit {
  displayedColumns: string[] = ['select', 'id', 'name', 'updated_at', 'category', 'options', 'status', 'action'];

  testGroup: MatTableDataSource<TestGroup> = new MatTableDataSource<TestGroup>([]);
  selection = new SelectionModel<TestGroupCore>(true, []);
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
    public matDialogRef: MatDialogRef<Pack[]>
  ) {
    this.noData = this.testGroup.connect().pipe(map(data => data.length === 0));
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  ngOnInit(): void {
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
