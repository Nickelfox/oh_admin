import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { DifficultyEnum, PublishStatusEnum, StatusChipType, TagCategoryEnum } from '@hidden-innovation/shared/models';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { TestGroup } from '@hidden-innovation/test-group/data-access';

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
  selector: 'hidden-innovation-test-group-listing',
  templateUrl: './test-group-listing.component.html',
  styleUrls: ['./test-group-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestGroupListingComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'updated_at', 'category', 'options', 'status', 'action'];

  testGroup: MatTableDataSource<TestGroup> = new MatTableDataSource<TestGroup>([]);
  noData: Observable<boolean>;

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  difficultyIte = Object.values(DifficultyEnum);
  tagCategoryIte = Object.values(TagCategoryEnum);

  publishStatusEnum = PublishStatusEnum;
  statusChipType = StatusChipType;

  constructor(
    public constantDataService: ConstantDataService
  ) {
    this.noData = this.testGroup.connect().pipe(map(data => data.length === 0));
    this.testGroup = new MatTableDataSource<TestGroup>(dummyTestGroup);
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  ngOnInit(): void {
  }

}
