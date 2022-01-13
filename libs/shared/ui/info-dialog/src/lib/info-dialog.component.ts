import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GenericDialogInfo } from '@hidden-innovation/shared/models';

@Component({
  selector: 'hidden-innovation-info-dialog',
  template: `
    <div>
      <h2 mat-dialog-title class='font-calibri--bold mb-0'>{{data.title}}</h2>
    </div>
    <mat-dialog-content>
      <p class='text-muted font-sf-pro mb-0'>{{data.desc}}</p>
    </mat-dialog-content>
    <mat-dialog-actions align='end'>
      <button mat-flat-button [class]='data.action.type' (click)='dialogRef.close()'>{{data.action.buttonText}}</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./info-dialog.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GenericDialogInfo
  ) {
  }
}
