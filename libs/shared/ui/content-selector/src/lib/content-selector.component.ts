import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PackContent, PackStore } from '@hidden-innovation/pack/data-access';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { map } from 'rxjs/operators';
import { UiStore } from '@hidden-innovation/shared/store';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { differenceBy } from 'lodash-es';
import { GenericDialogPrompt } from '@hidden-innovation/shared/models';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';

@Component({
  selector: 'hidden-innovation-content-selector',
  templateUrl: './content-selector.component.html',
  styleUrls: ['./content-selector.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentSelectorComponent implements OnInit {

  displayedColumns: string[] = ['select', 'id', 'name', 'type', 'created_at', 'inputType'];
  contents: MatTableDataSource<PackContent> = new MatTableDataSource<PackContent>();

  noData: Observable<boolean>;

  // Paginator options
  pageIndex = this.constantDataService.PaginatorData.pageIndex;
  pageSizeOptions = [15, 30, 45, 60];
  pageSize = 15;
  pageEvent: PageEvent | undefined;

  selectedContents: PackContent[] = [];
  dummyContents: PackContent[] = [];

  initialised = false;

  constructor(
    public constantDataService: ConstantDataService,
    public store: PackStore,
    private matDialog: MatDialog,
    public matDialogRef: MatDialogRef<PackContent[]>,
    public uiStore: UiStore,
    private cdr: ChangeDetectorRef
  ) {
    this.noData = this.contents.connect().pipe(map(data => data.length === 0));
    this.uiStore.selectedPackContents$.subscribe(contents => {
      this.selectedContents = contents;
      this.dummyContents = contents;
    });
    if (!this.initialised) {
      this.uiStore.patchState({
        selectedContent: this.selectedContents
      });
      this.initialised = true;
    }
    this.refreshList();
  }

  get paginatorIndex() {
    return this.pageIndex - 1;
  }

  ngOnInit(): void {
    this.store.packContents$.subscribe(
      (contents) => {
        this.contents = new MatTableDataSource<PackContent>(contents);
        this.noData = this.contents.connect().pipe(map(data => data.length === 0));
        if (!contents?.length && (this.pageIndex > this.constantDataService.PaginatorData.pageIndex)) {
          this.resetPagination();
        }
        this.cdr.markForCheck();
      }
    );
  }

  resetPagination(): void {
    this.pageIndex = this.constantDataService.PaginatorData.pageIndex;
    this.pageSize = this.constantDataService.PaginatorData.pageSize;
  }

  refreshList(): void {
    this.store.getPackContent$({
      page: this.pageIndex,
      limit: this.pageSize
    });
  }

  onPaginateChange($event: PageEvent): void {
    this.pageIndex = $event.pageIndex + 1;
    this.pageSize = $event.pageSize;
    this.refreshList();
  }

  trackById(index: number, content: PackContent): number {
    return content.id;
  }

  isSelected(content: PackContent): boolean {
    return !!this.selectedContents.find(value => value.id === content.id);
  }

  addToList(content: PackContent): void {
    if (!this.selectedContents.find(value => value.id === content.id)) {
      this.selectedContents = [
        ...this.selectedContents,
        content
      ];
    } else {
      this.selectedContents = [
        ...this.selectedContents.filter(t => t.id !== content.id)
      ];
    }
  }

  saveSelectedContents(): void {
    this.uiStore.patchState({
      selectedContent: [
        ...this.selectedContents
      ]
    });
    this.matDialogRef.close(this.selectedContents);
  }

  closeDialog(): void {
    const isDifferent = differenceBy(this.selectedContents, [...this.dummyContents], 'id');
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
          this.saveSelectedContents();
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
