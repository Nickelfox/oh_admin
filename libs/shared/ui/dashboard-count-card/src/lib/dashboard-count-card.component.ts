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
  @Input() cardTitle!: string | null;

}
