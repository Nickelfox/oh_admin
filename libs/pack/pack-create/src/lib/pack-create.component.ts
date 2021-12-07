import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LessonCreateComponent } from '@hidden-innovation/shared/ui/lesson-create';
import { PackCore } from '@hidden-innovation/pack/data-access';

export interface LessonDialogReq {
  isNew: boolean;
}

@Component({
  selector: 'hidden-innovation-pack-create',
  templateUrl: './pack-create.component.html',
  styleUrls: ['./pack-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackCreateComponent implements OnInit {

  constructor(
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openCreateLessonDialog():void
  {
    const lessonCreateReqObj: LessonDialogReq = {
      isNew: true
    };
    const dialogRef = this.matDialog.open(LessonCreateComponent, {
      data: lessonCreateReqObj,
      minWidth: '25rem'
    });
    dialogRef.afterClosed().subscribe( (pack: PackCore) => {
      if (pack) {
        return;
      }
    });
  }
}
