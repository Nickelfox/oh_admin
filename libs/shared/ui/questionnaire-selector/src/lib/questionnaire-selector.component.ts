import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Questionnaire } from '@hidden-innovation/questionnaire/data-access';
import { PageEvent } from '@angular/material/paginator';
import { PublishStatusEnum, StatusChipType } from '@hidden-innovation/shared/models';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';


@Component({
  selector: 'hidden-innovation-questionnaire-selector',
  templateUrl: './questionnaire-selector.component.html',
  styleUrls: ['./questionnaire-selector.component.sass'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionnaireSelectorComponent implements OnInit {

  displayedColumns: string[] = ['select','id', 'name', 'date_added', 'questions', 'scoring', 'status', 'action'];
  questionnaires: MatTableDataSource<Questionnaire> = new MatTableDataSource<Questionnaire>();

// Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = this.constantDataService.PaginatorData.pageSizeOptions;
  pageSize = this.constantDataService.PaginatorData.pageSize;
  pageEvent: PageEvent | undefined;

  statusChipType = StatusChipType;
  publishStatusEnum = PublishStatusEnum;

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  constructor(
    public constantDataService: ConstantDataService,
  ) {
  }

  ngOnInit(): void {

  }

}
