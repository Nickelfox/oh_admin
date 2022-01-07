import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  Questionnaire,
  QuestionnaireExtended,
  QuestionnaireListingFilters,
  QuestionnaireStore
} from '@hidden-innovation/questionnaire/data-access';
import { PageEvent } from '@angular/material/paginator';
import { GenericDialogPrompt, SortingEnum, StatusChipType, UserStatusEnum } from '@hidden-innovation/shared/models';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { Observable } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { differenceBy, isEqual } from 'lodash-es';
import { MatSelectionListChange } from '@angular/material/list';
import { UiStore } from '@hidden-innovation/shared/store';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-questionnaire-selector',
  templateUrl: './questionnaire-selector.component.html',
  styleUrls: ['./questionnaire-selector.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionnaireSelectorComponent implements OnInit {

  displayedColumns: string[] = ['select', 'id', 'name', 'date_added', 'questions', 'scoring', 'status'];
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

  selectedQuestionnaires: QuestionnaireExtended[] = [];
  dummyQuestionnaires: QuestionnaireExtended[] = [];

  initialised = false;


  constructor(
    public matDialogRef: MatDialogRef<Questionnaire[]>,
    public constantDataService: ConstantDataService,
    public store: QuestionnaireStore,
    private cdr: ChangeDetectorRef,
    private matDialog: MatDialog,
    public uiStore: UiStore
  ) {
    this.noData = this.questionnaires.connect().pipe(map(data => data.length === 0));
    this.uiStore.selectedQuestionnaires$.subscribe(tgs => {
      this.selectedQuestionnaires = tgs;
      this.dummyQuestionnaires = tgs;
    });
    if (!this.initialised) {
      this.uiStore.patchState({
        selectedQuestionnaires: this.selectedQuestionnaires
      });
      this.initialised = true;
    }
    this.refreshList();
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  isSelected(q: QuestionnaireExtended): boolean {
    return !!this.selectedQuestionnaires.find(value => value.id === q.id);
  }

  addToList(q: QuestionnaireExtended): void {
    if (!this.selectedQuestionnaires.find(value => value.id === q.id)) {
      this.selectedQuestionnaires = [
        ...this.selectedQuestionnaires,
        q
      ];
    } else {
      this.selectedQuestionnaires = [
        ...this.selectedQuestionnaires.filter(t => t.id !== q.id)
      ];
    }
  }

  resetPagination(): void {
    this.pageIndex = this.constantDataService.PaginatorData.pageIndex;
    this.pageSize = this.constantDataService.PaginatorData.pageSize;
  }

  refreshList(): void {
    const { nameSort, dateSort, scoring, active, search } = this.filters.value;
    this.store.getQuestionnaires$({
      page: this.pageIndex,
      limit: this.pageSize,
      nameSort,
      dateSort,
      scoring,
      active,
      search
    });
  }

  ngOnInit(): void {
    this.store.state$.subscribe(
      ({ questionnaires }) => {
        this.questionnaires = new MatTableDataSource<Questionnaire>(questionnaires);
        this.noData = this.questionnaires.connect().pipe(map(data => data.length === 0));
        if (!questionnaires?.length && (this.pageIndex > this.constantDataService.PaginatorData.pageIndex)) {
          this.resetPagination();
        }
        this.cdr.markForCheck();
      }
    );
    this.filters.valueChanges.pipe(
      distinctUntilChanged((x, y) => isEqual(x, y)),
      tap(_ => this.refreshList())
    ).subscribe();
  }

  onPaginateChange($event: PageEvent): void {
    this.pageIndex = $event.pageIndex + 1;
    this.pageSize = $event.pageSize;
    this.refreshList();
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

  saveSelectedQuestionnaires(): void {
    this.uiStore.patchState({
      selectedQuestionnaires: [
        ...this.selectedQuestionnaires
      ]
    });
    this.matDialogRef.close();
  }

  closeDialog(): void {
    const isDifferent = differenceBy(this.selectedQuestionnaires, [...this.dummyQuestionnaires], 'id');
    if (isDifferent.length) {
      const dialogData: GenericDialogPrompt = {
        title: 'Review Changes',
        desc: `You have made changes. Do you want to save them?`,
        action: {
          posTitle: 'Save',
          negTitle: 'Discard',
          type: 'mat-primary'
        }
      };
      const dialogRef = this.matDialog.open(PromptDialogComponent, {
        data: dialogData,
        minWidth: '25rem'
      });
      dialogRef.afterClosed().subscribe((proceed: boolean) => {
        if (proceed === true) {
          this.saveSelectedQuestionnaires();
        } else if (proceed === false) {
          this.matDialogRef.close();
        } else {
          dialogRef.close();
        }
      });
    } else {
      this.matDialogRef.close();
    }
  }


}
