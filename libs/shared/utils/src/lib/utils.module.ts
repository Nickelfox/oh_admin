import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisableCopyPasteDirective } from './directives/disable-copy-paste.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    DisableCopyPasteDirective
  ],
  exports: [
    DisableCopyPasteDirective
  ]
})
export class UtilsModule {}
