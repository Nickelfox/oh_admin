import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileNameDialogComponent } from './file-name-dialog.component';
import { MaterialModule } from '@hidden-innovation/material';
import { FormFieldErrorsModule } from '@hidden-innovation/shared/ui/form-field-errors';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormFieldErrorsModule,
  ],
  declarations: [
    FileNameDialogComponent
  ],
})
export class FileNameDialogModule {}
