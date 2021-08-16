import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthFacade} from "@hidden-innovation/auth";

@Component({
  selector: 'hidden-innovation-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  constructor(public authFacade: AuthFacade) {
  }

  ngOnInit(): void {
  }

  login(): void {
    this.authFacade.login('deepak@nickelfox.com', 'Test@12345');
  }

}
