import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'hidden-innovation-file-name-dialog',
  template: `
    <div>
      <h2 mat-dialog-title class='font-calibri--bold mb-0'>Confirm File Name</h2>
    </div>
    <mat-dialog-content>
      <mat-form-field class='w-100'>
        <mat-label>{{constantDataService.FIELD_NAME.FILE_NAME | titlecase}}</mat-label>
        <input matInput autocomplete='no' type='text' [formControl]='fileName'>
        <mat-error>
          <ng-template [ngIf]='((fileName.touch$ | async) || (fileName.dirty$ | async)) && (fileName.errors$ | async)'
                       let-error>
            <hidden-innovation-form-field-errors
              [label]='constantDataService.FIELD_NAME.FILE_NAME | titlecase'
              [error]='error'
            ></hidden-innovation-form-field-errors>
          </ng-template>
        </mat-error>
      </mat-form-field>

    </mat-dialog-content>
    <mat-dialog-actions align='end'>
      <button mat-stroked-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color='primary' (click)='submit()'>Confirm</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./file-name-dialog.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileNameDialogComponent {

  fileName: FormControl<string> = new FormControl<string>('', [
    ...this.formValidationService.requiredFieldValidation
  ]);

  constructor(
    public constantDataService: ConstantDataService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public currentFileName: string,
    private hotToastService: HotToastService,
    public dialogRef: MatDialogRef<FileNameDialogComponent>,
    private formValidationService: FormValidationService
  ) {
    this.fileName.setValue(currentFileName ?? '');
  }

  submit(): void {
    this.fileName.markAllAsDirty();
    this.fileName.markAllAsTouched();
    if (this.fileName.invalid) {
      this.hotToastService.error(this.formValidationService.formSubmitError);
      return;
    }
    this.dialogRef.close(this.fileName.value);
  }
}
