import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'hidden-innovation-spinner-text',
  templateUrl: './spinner-text.component.html',
  styleUrls: ['./spinner-text.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerTextComponent {

  @Input() spinnerMode: ProgressSpinnerMode = 'indeterminate';
  @Input() color?: ThemePalette;
  @Input() value:number | null = 0;
  @Input() size = 20;
  @Input() text: string | null = '--';

}
