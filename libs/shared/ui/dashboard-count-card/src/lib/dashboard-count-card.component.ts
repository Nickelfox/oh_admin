import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'hidden-innovation-dashboard-count-card',
  templateUrl: './dashboard-count-card.component.html',
  styleUrls: ['./dashboard-count-card.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardCountCardComponent {

  @Input() icon!: string | null;
  @Input() isLoading!: boolean | null;
  @Input() count!: number | null;
  @Input() change!: number | null;
  @Input() cardTitle!: string | null;

  get isPositive(): boolean | null {
    if (this.change === null) return null;
    if (this.change === undefined) return null;
    if (this.change === 0) return null;
    return this.change > 0;
  }

}
