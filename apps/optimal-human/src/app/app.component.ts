import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'hidden-innovation-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
}
