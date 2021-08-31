import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PromptDialogComponent} from './prompt-dialog.component';
import {MaterialModule} from "@hidden-innovation/material";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    PromptDialogComponent
  ],
})
export class PromptDialogModule {
}
