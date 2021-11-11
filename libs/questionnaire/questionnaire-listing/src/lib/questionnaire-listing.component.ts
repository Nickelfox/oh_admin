import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { PageEvent } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { Questionnaire, QuestionnaireStore } from '@hidden-innovation/questionnaire/data-access';
import { StatusChipType, UserStatusEnum } from '@hidden-innovation/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-questionnaire-listing',
  templateUrl: './questionnaire-listing.component.html',
  styleUrls: ['./questionnaire-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionnaireListingComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'date_added', 'questions', 'scoring', 'status', 'action'];
  questionnaires: MatTableDataSource<Questionnaire> = new MatTableDataSource<Questionnaire>();

  noData: Observable<boolean>;

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  statusChipType = StatusChipType;
  userStatusEnum = UserStatusEnum;

  listingRoute = '/questionnaire/listing/';

  constructor(
    public constantDataService: ConstantDataService,
    public store: QuestionnaireStore,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.noData = this.questionnaires.connect().pipe(map(data => data.length === 0));
    this.route.params.subscribe((params) => {
      this.pageIndex = params['index'];
      this.pageSize = params['size'];
      this.refreshList();
    });
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  refreshList(): void {
    this.store.getQuestionnaires$({
      page: this.pageIndex,
      limit: this.pageSize
    });
  }

  ngOnInit(): void {
    this.store.state$.subscribe(
      ({ questionnaires }) => {
        this.questionnaires = new MatTableDataSource<Questionnaire>(questionnaires);
        this.noData = this.questionnaires.connect().pipe(map(data => data.length === 0));
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
