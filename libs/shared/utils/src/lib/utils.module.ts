import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisableCopyPasteDirective } from './directives/disable-copy-paste.directive';
import { MaxStringLimitPipe } from './pipes/max-string-limit.pipe';
import { ReplaceUnderscorePipe } from './pipes/replace-underscore.pipe';
import { PendingChangesGuard } from './guards/pending-changes.guard';

@NgModule({
  imports: [CommonModule],
  declarations: [
    DisableCopyPasteDirective,
    MaxStringLimitPipe,
    ReplaceUnderscorePipe,
  ],
  exports: [
    DisableCopyPasteDirective,
    MaxStringLimitPipe,
    ReplaceUnderscorePipe,
  ],
  providers:[
    PendingChangesGuard
  ]
})
export class UtilsModule {}
