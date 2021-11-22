import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { PageEvent } from '@angular/material/paginator';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import {
  Questionnaire,
  QuestionnaireDeleteRequest,
  QuestionnaireListingFilters,
  QuestionnaireStore
} from '@hidden-innovation/questionnaire/data-access';
import { SortingEnum, StatusChipType, UserStatusEnum } from '@hidden-innovation/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { isEqual } from 'lodash-es';
import { MatSelectionListChange } from '@angular/material/list';

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

  filters: FormGroup<QuestionnaireListingFilters> = new FormGroup<QuestionnaireListingFilters>({
    dateSort: new FormControl(SortingEnum.DESC),
    nameSort: new FormControl({ value: undefined, disabled: true }),
    active: new FormControl({ value: undefined, disabled: true }),
    scoring: new FormControl({ value: undefined, disabled: true })
  });

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  statusChipType = StatusChipType;
  userStatusEnum = UserStatusEnum;
  sortingEnum = SortingEnum;

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
    const { nameSort, dateSort, scoring, active } = this.filters.value;
    this.store.getQuestionnaires$({
      page: this.pageIndex,
      limit: this.pageSize,
      nameSort,
      dateSort,
      scoring,
      active
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
    this.filters.valueChanges.pipe(
      distinctUntilChanged((x, y) => isEqual(x, y)),
      tap(_ => this.refreshList())
    ).subscribe();
  }

  onPaginateChange($event: PageEvent): void {
    this.router.navigate([
      this.listingRoute, $event.pageSize, $event.pageIndex + 1
    ], {
      relativeTo: this.route
    });
  }

  deleteQuestionnaire(id: number) {
    const { scoring, active, dateSort, nameSort } = this.filters.value;
    const deleteObj: QuestionnaireDeleteRequest = {
      id,
      dateSort,
      nameSort,
      active,
      scoring,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    };
    this.store.deleteQuestionnaire(deleteObj);
  }

  updateSorting(fieldName: 'dateSort' | 'nameSort'): void {
    const { nameSort, dateSort } = this.filters.controls;

    const updateSortingCtrl = (ctrl: FormControl) => {
      if (ctrl.disabled) {
        ctrl.setValue(this.sortingEnum.DESC);
        ctrl.enable();
      } else {
        ctrl.value === SortingEnum.DESC ? ctrl.setValue(this.sortingEnum.ASC) : ctrl.setValue(this.sortingEnum.DESC);
      }
      this.cdr.markForCheck();
    };

    switch (fieldName) {
      case 'nameSort':
        dateSort.disable();
        updateSortingCtrl(nameSort);
        break;
      case 'dateSort':
        nameSort.disable();
        updateSortingCtrl(dateSort);
        break;
    }
  }

  updateFilterChange(matSelection: MatSelectionListChange, ctrl: FormControl): void {
    const value = matSelection.source._value as unknown as Array<'TRUE' | 'FALSE' | undefined>;
    let expandedVal: 'TRUE' | 'FALSE' | undefined;
    try {
      expandedVal = value[0] ?? undefined;
    } catch {
      expandedVal = undefined;
    }
    if (expandedVal !== undefined && expandedVal !== null) {
      ctrl.setValue(expandedVal);
      ctrl.enable();
    } else {
      ctrl.setValue(undefined);
      ctrl.disable();
    }
  }

}
