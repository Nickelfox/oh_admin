import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthFacade } from '@hidden-innovation/auth';

@Component({
  selector: 'hidden-innovation-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(public authFacade: AuthFacade) {
  }

  ngOnInit(): void {
  }

  login(): void {
    this.authFacade.login('deepak@nickelfox.com', 'Test@12345');
  }
}
