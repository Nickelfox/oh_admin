import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  Questionnaire,
  QuestionnaireExtended,
  QuestionnaireListingFilters,
  QuestionnaireStore
} from '@hidden-innovation/questionnaire/data-access';
import { PageEvent } from '@angular/material/paginator';
import {
  ContentSelectorOpType,
  PackContentTypeEnum,
  SortingEnum,
  StatusChipType,
  UserStatusEnum
} from '@hidden-innovation/shared/models';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { Observable } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { isEqual } from 'lodash-es';
import { MatSelectionListChange } from '@angular/material/list';
import { UiStore } from '@hidden-innovation/shared/store';
import { HotToastService } from '@ngneat/hot-toast';
import { ContentCore, LessonCore } from '@hidden-innovation/pack/data-access';

export interface QuestionnaireSelectorData {
  type: ContentSelectorOpType;
  limit?: boolean;
}

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
  questionnaires: MatTableDataSource<QuestionnaireExtended> = new MatTableDataSource<QuestionnaireExtended>();

  noData?: Observable<boolean>;

  filters: FormGroup<QuestionnaireListingFilters> = new FormGroup<QuestionnaireListingFilters>({
    dateSort: new FormControl(SortingEnum.DESC),
    nameSort: new FormControl({ value: undefined, disabled: true }),
    active: new FormControl(undefined),
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

  selectedContents: (ContentCore | LessonCore)[] = [];
  dummyContents: (ContentCore | LessonCore)[] = [];

  initialised = false;
  isLoading = false;

  constructor(
    public matDialogRef: MatDialogRef<Questionnaire[]>,
    public constantDataService: ConstantDataService,
    @Inject(MAT_DIALOG_DATA) public questionnaireData: QuestionnaireSelectorData,
    public store: QuestionnaireStore,
    private cdr: ChangeDetectorRef,
    private matDialog: MatDialog,
    public uiStore: UiStore,
    private hotToastService: HotToastService
  ) {
    if (!this.questionnaireData) {
      this.hotToastService.error('Application Error! Category data needs to to sent before selecting any questionnaires');
      this.matDialogRef.close();
      return;
    }
    this.noData = this.questionnaires.connect().pipe(map(data => data.length === 0));
    this.uiStore.state$.subscribe(res => {
      switch (this.questionnaireData.type) {
        case ContentSelectorOpType.SINGLE:
          this.selectedQuestionnaires = res.selectedQuestionnaires ?? [];
          this.dummyQuestionnaires = res.selectedQuestionnaires ?? [];
          break;
        case ContentSelectorOpType.OTHER:
          this.selectedContents = res.selectedContent ?? [];
          this.dummyContents = res.selectedContent ?? [];
          break;
      }
    });
    if (!this.initialised) {
      switch (this.questionnaireData.type) {
        case ContentSelectorOpType.SINGLE:
          this.uiStore.patchState({
            selectedQuestionnaires: this.selectedQuestionnaires
          });
          break;
        case ContentSelectorOpType.OTHER:
          this.uiStore.patchState({
            selectedContent: this.selectedContents
          });
          break;
      }
      this.initialised = true;
      this.cdr.markForCheck();
    }
    this.refreshList();
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  isSelected(q: QuestionnaireExtended): boolean {
    switch (this.questionnaireData.type) {
      case ContentSelectorOpType.SINGLE:
        return !!this.selectedQuestionnaires.find(value => value.id === q.id);
      case ContentSelectorOpType.OTHER:
        return !!this.selectedContents.find(value => (value.contentId === q.id) && (value.type === PackContentTypeEnum.QUESTIONNAIRE));
    }
  }

  addToList(q: QuestionnaireExtended): void {
    let selectedContent: (ContentCore | LessonCore)[] = [];
    let selectedQuestionnaires: QuestionnaireExtended[] = [];
    let selectedItem: ContentCore;
    switch (this.questionnaireData.type) {
      case ContentSelectorOpType.SINGLE:
        if (!this.selectedQuestionnaires.find(value => value.id === q.id)) {
          if (this.questionnaireData?.limit) {
            selectedQuestionnaires = [q];
          } else {
            selectedQuestionnaires = [
              ...this.selectedQuestionnaires,
              q
            ];
          }
        } else {
          selectedQuestionnaires = [
            ...this.selectedQuestionnaires.filter(t => t.id !== q.id)
          ];
        }
        this.uiStore.patchState({
          selectedQuestionnaires
        });
        break;
      case ContentSelectorOpType.OTHER:
        selectedItem = this.selectedContents.find(value => (value.contentId === q.id) && (value.type === PackContentTypeEnum.QUESTIONNAIRE)) as ContentCore;
        if (selectedItem) {
          selectedContent = [...this.selectedContents.filter(value => !isEqual(value, selectedItem))];
        } else {
          if (this.questionnaireData?.limit) {
            selectedContent = [{
              contentId: q.id,
              type: PackContentTypeEnum.QUESTIONNAIRE,
              name: q.name
            } as ContentCore];
          } else {
            selectedContent = [
              ...this.selectedContents,
              {
                contentId: q.id,
                type: PackContentTypeEnum.QUESTIONNAIRE,
                name: q.name
              } as ContentCore
            ];
          }
        }
        this.uiStore.patchState({
          selectedContent
        });
        break;
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
        this.questionnaires = new MatTableDataSource<QuestionnaireExtended>(questionnaires);
        this.noData = this.questionnaires.connect().pipe(map(data => data.length === 0));
        if (!questionnaires?.length && (this.pageIndex > this.constantDataService.PaginatorData.pageIndex)) {
          this.resetPagination();
        }
        this.cdr.markForCheck();
      }
    );
    this.store.isLoading$.subscribe(loading => this.isLoading = loading);
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


  trackById(index: number, q: QuestionnaireExtended): number {
    return q.id;
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

  // closeDialog(): void {
  //   const isDifferent = differenceBy(this.selectedQuestionnaires, [...this.dummyQuestionnaires], 'id');
  //   if (isDifferent.length) {
  //     const dialogData: GenericDialogPrompt = {
  //       title: 'Review Changes',
  //       desc: `You have made changes. Do you want to save them?`,
  //       action: {
  //         posTitle: 'Save',
  //         negTitle: 'Discard',
  //         type: 'mat-primary'
  //       }
  //     };
  //     const dialogRef = this.matDialog.open(PromptDialogComponent, {
  //       data: dialogData,
  //       minWidth: '25rem'
  //     });
  //     dialogRef.afterClosed().subscribe((proceed: boolean) => {
  //       if (proceed === true) {
  //         this.saveSelectedQuestionnaires();
  //       } else if (proceed === false) {
  //         this.matDialogRef.close();
  //       } else {
  //         dialogRef.close();
  //       }
  //     });
  //   } else {
  //     this.matDialogRef.close();
  //   }
  // }


}
