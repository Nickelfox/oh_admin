import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { UserListingFacade } from './state/user-listing.facade';
import { MatTableDataSource } from '@angular/material/table';
import { StatusChipType, UserDetails, UserStatusEnum } from '@hidden-innovation/shared/models';
import { UntilDestroy } from '@ngneat/until-destroy';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';

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
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  userStatusEnum = UserStatusEnum;

  statusChipType = StatusChipType;

  constructor(
    public constantDataService: ConstantDataService,
    public facade: UserListingFacade,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.pageIndex = params['index'];
      this.pageSize = params['size'];
      this.facade.getList({
        page: this.pageIndex,
        limit: this.pageSize
      });
    });
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
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
    console.log($event);
    this.router.navigate([
      '/users/listing/', $event.pageSize, $event.pageIndex + 1
    ], {
      relativeTo: this.route
    });
  }

}
