import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TestSelectorComponent } from '@hidden-innovation/shared/ui/test-selector';
import { SelectionModel } from '@angular/cdk/collections';
import { Test } from '@hidden-innovation/test/data-access';

@Component({
  selector: 'hidden-innovation-test-group-create',
  templateUrl: './test-group-create.component.html',
  styleUrls: ['./test-group-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestGroupCreateComponent implements OnInit {

  selection = new SelectionModel<Test>(true, []);

  constructor(
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
  }

  openTestSelector(): void {
    const dialogRef = this.matDialog.open(TestSelectorComponent, {
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      role: 'dialog'
    });
    dialogRef.afterClosed().subscribe((tests: Test[] | undefined) => {
      if (tests !== undefined && tests !== null) {
        this.selection.select(...tests);
        this.cdr.markForCheck();
      }
    });
  }

}
