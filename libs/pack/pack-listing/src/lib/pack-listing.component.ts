import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import  { PackCore } from '@hidden-innovation/pack/data-access';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { DateTime } from 'luxon';
import { PublishStatusEnum, StatusChipType } from '@hidden-innovation/shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';



export const dummyPacks: PackCore[] = [
  {
    id: 0,
    name: 'Pack 1',
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate(),
    lessons: 3,
    tests: 2,
    status: true
  },
  {
    id: 1,
    name: 'Pack 2',
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate(),
    lessons: 5,
    tests: 3,
    status: false
  },
  {
    id: 2,
    name: 'Pack 3',
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate(),
    lessons: 5,
    tests: 3,
    status: false
  },
  {
    id: 3,
    name: 'Pack 4',
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate(),
    lessons: 5,
    tests: 3,
    status: true
  },
  {
    id: 4,
    name: 'Pack 5',
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate(),
    lessons: 5,
    tests: 3,
    status: false
  },
  {
    id: 5,
    name: 'Pack 6',
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate(),
    lessons: 5,
    tests: 3,
    status: true
  }
]

@Component({
  selector: 'hidden-innovation-pack-listing',
  templateUrl: './pack-listing.component.html',
  styleUrls: ['./pack-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackListingComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'updated_at', 'lessons', 'tests', 'status', 'action'];
  packs: MatTableDataSource<PackCore> = new MatTableDataSource<PackCore>();

  noData: Observable<boolean>;

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  statusChipType = StatusChipType;
  publishStatusEnum = PublishStatusEnum;

  constructor(
    public constantDataService: ConstantDataService
  ) {
    this.noData = this.packs.connect().pipe(map(data => data.length === 0));
    this.packs = new MatTableDataSource<PackCore>(dummyPacks);
  }

  ngOnInit(): void {
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }
}
