import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisableCopyPasteDirective } from './directives/disable-copy-paste.directive';
import { MaxStringLimitPipe } from './pipes/max-string-limit.pipe';
import { ReplaceUnderscorePipe } from './pipes/replace-underscore.pipe';
import { PendingChangesGuard } from './guards/pending-changes.guard';
import { ImagePreloaderDirective } from './directives/image-preloader.directive';
import { ParseOneRemPipe } from './pipes/parse-one-rem.pipe';
import { DistanceLengthPipe } from './pipes/distance-length.pipe';
import { ContentSelectionService } from './services/content-selection.service';

@NgModule({
  imports: [CommonModule],
  declarations: [
    DisableCopyPasteDirective,
    MaxStringLimitPipe,
    ReplaceUnderscorePipe,
    ImagePreloaderDirective,
    ParseOneRemPipe,
    DistanceLengthPipe,
  ],
  exports: [
    DisableCopyPasteDirective,
    MaxStringLimitPipe,
    ReplaceUnderscorePipe,
    ParseOneRemPipe,
    ImagePreloaderDirective,
    DistanceLengthPipe
  ],
  providers:[
    PendingChangesGuard,
    ContentSelectionService,
  ]
})
export class UtilsModule {}
