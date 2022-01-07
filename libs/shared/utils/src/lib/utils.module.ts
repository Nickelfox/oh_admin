import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisableCopyPasteDirective } from './directives/disable-copy-paste.directive';
import { MaxStringLimitPipe } from './pipes/max-string-limit.pipe';
import { ReplaceUnderscorePipe } from './pipes/replace-underscore.pipe';
import { PendingChangesGuard } from './guards/pending-changes.guard';
import { ImagePreloaderDirective } from './directives/image-preloader.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    DisableCopyPasteDirective,
    MaxStringLimitPipe,
    ReplaceUnderscorePipe,
    ImagePreloaderDirective,
  ],
  exports: [
    DisableCopyPasteDirective,
    MaxStringLimitPipe,
    ReplaceUnderscorePipe,
    ImagePreloaderDirective
  ],
  providers:[
    PendingChangesGuard
  ]
})
export class UtilsModule {}
