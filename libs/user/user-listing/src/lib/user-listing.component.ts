import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { UserListingFacade } from './state/user-listing.facade';
import { MatTableDataSource } from '@angular/material/table';
import { UserDetails } from '@hidden-innovation/shared/models';
import { UntilDestroy } from '@ngneat/until-destroy';
import { PageEvent } from '@angular/material/paginator';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserListingComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'country', 'date_of_joining', 'status', 'action'];

  users: MatTableDataSource<UserDetails> = new MatTableDataSource<UserDetails>();

  // Paginator options
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 100];
  pageSize = this.pageSizeOptions[1];
  pageEvent: PageEvent | undefined;

  constructor(
    public constantDataService: ConstantDataService,
    public facade: UserListingFacade,
    private cdr: ChangeDetectorRef
  ) {
    this.facade.init({
      page: this.pageIndex + 1,
      limit: this.pageSize
    });
  }

  ngOnInit(): void {
    this.facade.users$.subscribe(
      users => {
        this.users = new MatTableDataSource<UserDetails>(users);
        this.cdr.markForCheck();
      }
    );
  }

  onPaginateChange($event: PageEvent): void {
    this.facade.setListData({
      page: $event.pageIndex + 1,
      limit: $event.pageSize
    });
  }

}
