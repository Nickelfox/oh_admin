import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'hidden-innovation-shimmer',
  template: `
    <div class='shimmer-loader' [ngStyle]="{'width': width, 'height': getHeight(), 'borderRadius': getBorderRadius()}">
    </div>
  `,
  styleUrls: ['./shimmer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShimmerComponent {

  @Input() type: 'line' | 'square' | 'circle' = 'line';
  @Input() width = '80%';
  @Input() height = '18px';
  @Input() rounded = false;

  getHeight(): string {
    if (this.type === 'circle' || this.type === 'square') {
      return this.width;
    }
    return this.height;
  }

  getBorderRadius(): string {
    if (this.type === 'circle') {
      return '50%';
    }
    if (this.type === 'square') {
      return '0px';
    }
    if (this.rounded) {
      return '5px';
    }
    return '0px';
  }

}
