import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthFacade} from "@hidden-innovation/auth";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'hidden-innovation-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  sideBarOpen = true;
  isLoading = false;
  isTablet = false;
  isSliding = false;

  constructor(
    public breakpointObserver: BreakpointObserver,
    public authFacade: AuthFacade
  ) {
    breakpointObserver.observe([
      Breakpoints.Tablet,
      Breakpoints.Handset
    ]).subscribe(result => {
      this.sideBarOpen = !result.matches;
      this.isTablet = result.matches;
    });
  }

  sideBarToggle(): void {
    if (!this.isSliding) {
      this.sideBarOpen = !this.sideBarOpen;
    }
  }
}
