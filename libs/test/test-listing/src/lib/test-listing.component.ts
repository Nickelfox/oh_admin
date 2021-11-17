import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TestCore } from '../../../data-access/src/lib/models/test.interface';
import { Observable } from 'rxjs';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { PageEvent } from '@angular/material/paginator';
import { DifficultyEnum, PublishStatusEnum, StatusChipType, TagCategoryEnum } from '@hidden-innovation/shared/models';
import { map } from 'rxjs/operators';
import { DateTime } from 'luxon';

const dummyTests: TestCore[] = [
  {
    id: 0,
    name: 'Test 1',
    category: TagCategoryEnum.CARDIO,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate(),
    difficulty: DifficultyEnum.ADVANCE,
    input: 'Ratio',
    status: true
  },
  {
    id: 1,
    name: 'Test 2',
    category: TagCategoryEnum.CARDIO,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate(),
    difficulty: DifficultyEnum.BEGINNER,
    input: '1RM',
    status: true
  },
  {
    id: 2,
    name: 'Test 2',
    category: TagCategoryEnum.LIFESTYLE,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate(),
    difficulty: DifficultyEnum.INTERMEDIATE,
    input: 'Questionnaire',
    status: false
  },
  {
    id: 3,
    name: 'Test 3',
    category: TagCategoryEnum.MOBILE,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate(),
    difficulty: DifficultyEnum.ADVANCE,
    input: 'None',
    status: true
  },
  {
    id: 4,
    name: 'Test 4',
    category: TagCategoryEnum.LIFESTYLE,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate(),
    difficulty: DifficultyEnum.ADVANCE,
    input: 'Weight',
    status: true
  }
];

@Component({
  selector: 'hidden-innovation-test-listing',
  templateUrl: './test-listing.component.html',
  styleUrls: ['./test-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestListingComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'updated_at', 'category', 'difficulty', 'input', 'status', 'action'];
  tests: MatTableDataSource<TestCore> = new MatTableDataSource<TestCore>();

  noData: Observable<boolean>;

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  tagCategoryEnum = TagCategoryEnum;
  statusChipType = StatusChipType;
  publishStatusEnum = PublishStatusEnum;

  constructor(
    public constantDataService: ConstantDataService
  ) {
    this.noData = this.tests.connect().pipe(map(data => data.length === 0));
    this.tests = new MatTableDataSource<TestCore>(dummyTests);
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  ngOnInit(): void {
  }

}
