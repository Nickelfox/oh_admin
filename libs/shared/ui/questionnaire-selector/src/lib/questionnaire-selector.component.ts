import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  Questionnaire,
  QuestionnaireListingFilters,
  QuestionnaireStore
} from '@hidden-innovation/questionnaire/data-access';
import { PageEvent } from '@angular/material/paginator';
import { PublishStatusEnum, SortingEnum, StatusChipType, UserStatusEnum } from '@hidden-innovation/shared/models';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { Observable } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { isEqual } from 'lodash-es';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-questionnaire-selector',
  templateUrl: './questionnaire-selector.component.html',
  styleUrls: ['./questionnaire-selector.component.sass'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionnaireSelectorComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'date_added', 'questions', 'scoring', 'status', 'action'];
  questionnaires: MatTableDataSource<Questionnaire> = new MatTableDataSource<Questionnaire>();

  noData: Observable<boolean>;

// Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;
  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  statusChipType = StatusChipType;
  userStatusEnum = UserStatusEnum;
  sortingEnum = SortingEnum;




  constructor(
    public constantDataService: ConstantDataService,
    public store: QuestionnaireStore,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.noData = this.questionnaires.connect().pipe(map(data => data.length === 0));
    this.route.params.subscribe((params) => {
      this.pageIndex = params['index'];
      this.pageSize = params['size'];
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



}
