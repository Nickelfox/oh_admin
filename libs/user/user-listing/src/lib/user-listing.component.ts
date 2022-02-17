import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { MatTableDataSource } from '@angular/material/table';
import { StatusChipType, UserDetails, UserStatusEnum } from '@hidden-innovation/shared/models';
import { UntilDestroy } from '@ngneat/until-destroy';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStore } from '@hidden-innovation/user/data-access';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormControl } from '@ngneat/reactive-forms';
import { Observable } from 'rxjs';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserListingComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'date_of_joining', 'status', 'action'];

  users: MatTableDataSource<UserDetails> = new MatTableDataSource<UserDetails>();
  noData: Observable<boolean>;

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  name: FormControl<string> = new FormControl<string>('');

  userStatusEnum = UserStatusEnum;
  listingRoute = '/users/listing/';
  statusChipType = StatusChipType;

  constructor(
    public constantDataService: ConstantDataService,
    public store: UserStore,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.noData = this.users.connect().pipe(map(data => data.length === 0));
    this.route.params.subscribe((params) => {
      this.pageIndex = params['index'];
      this.pageSize = params['size'];
      this.refreshList();
    });
    this.name.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(500)
    ).subscribe(_ => {
      this.refreshList();
    });
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  refreshList(): void {
    this.store.getUsers$({
      page: this.pageIndex,
      limit: this.pageSize,
      name: this.name.value
    });
  }

  ngOnInit(): void {
    this.store.state$.subscribe(
      ({ users }) => {
        this.users = new MatTableDataSource<UserDetails>(users);
        this.noData = this.users.connect().pipe(map(data => data.length === 0));
        this.cdr.markForCheck();
      }
    );
  }

  onPaginateChange($event: PageEvent): void {
    this.router.navigate([
      this.listingRoute, $event.pageSize, $event.pageIndex + 1
    ], {
      relativeTo: this.route
    });
  }

}
