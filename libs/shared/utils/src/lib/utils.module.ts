import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisableCopyPasteDirective } from './directives/disable-copy-paste.directive';
import { MaxStringLimitPipe } from './pipes/max-string-limit.pipe';
import { ReplaceUnderscorePipe } from './pipes/replace-underscore.pipe';
import { PendingChangesGuard } from './guards/pending-changes.guard';
import { ImagePreloaderDirective } from './directives/image-preloader.directive';
import { ParseOneRemPipe } from './pipes/parse-one-rem.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    DisableCopyPasteDirective,
    MaxStringLimitPipe,
    ReplaceUnderscorePipe,
    ImagePreloaderDirective,
    ParseOneRemPipe,
  ],
  exports: [
    DisableCopyPasteDirective,
    MaxStringLimitPipe,
    ReplaceUnderscorePipe,
    ParseOneRemPipe,
    ImagePreloaderDirective
  ],
  providers:[
    PendingChangesGuard
  ]
})
export class UtilsModule {}
