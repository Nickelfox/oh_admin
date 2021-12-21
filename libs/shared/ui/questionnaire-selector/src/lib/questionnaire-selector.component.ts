import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  Questionnaire,
  QuestionnaireListingFilters,
  QuestionnaireStore
} from '@hidden-innovation/questionnaire/data-access';
import { PageEvent } from '@angular/material/paginator';
import { SortingEnum, StatusChipType, UserStatusEnum } from '@hidden-innovation/shared/models';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { Observable } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Test } from '@hidden-innovation/test/data-access';
import { PackStore } from '../../../../../pack/data-access/src/lib/store/pack.store';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-questionnaire-selector',
  templateUrl: './questionnaire-selector.component.html',
  styleUrls: ['./questionnaire-selector.component.sass'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionnaireSelectorComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'date_added', 'questions', 'scoring', 'status'];
  questionnaires: MatTableDataSource<Questionnaire> = new MatTableDataSource<Questionnaire>();

  noData: Observable<boolean>;

  filters: FormGroup<QuestionnaireListingFilters> = new FormGroup<QuestionnaireListingFilters>({
    dateSort: new FormControl(SortingEnum.DESC),
    nameSort: new FormControl({ value: undefined, disabled: true }),
    active: new FormControl({ value: undefined, disabled: true }),
    scoring: new FormControl({ value: undefined, disabled: true }),
    search: new FormControl(undefined)
  });

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  statusChipType = StatusChipType;
  userStatusEnum = UserStatusEnum;
  sortingEnum = SortingEnum;

  selectedQuestionnaires: Questionnaire[] = [];
  dummyQuestionnaires: Questionnaire[] = [];

  initialised = false;


  constructor(
    public matDialogRef: MatDialogRef<Questionnaire[]>,
    public constantDataService: ConstantDataService,
    public store: QuestionnaireStore,
    private packStore: PackStore,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.noData = this.questionnaires.connect().pipe(map(data => data.length === 0));
    // this.packStore
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
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


}
