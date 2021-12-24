import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GenericDialogPrompt } from '@hidden-innovation/shared/models';

@Component({
  selector: 'hidden-innovation-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptDialogComponent {

  shouldUpdate = false;

  constructor(
    public dialogRef: MatDialogRef<PromptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GenericDialogPrompt
  ) {
  }


  emitEvent(shouldProceed: boolean = false): void {
    this.shouldUpdate = shouldProceed;
    this.dialogRef.close(this.shouldUpdate);
  }

}
