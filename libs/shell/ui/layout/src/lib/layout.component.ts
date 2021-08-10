import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SettingsFacade, SettingsState} from "@hidden-innovation/settings/data-access";
import {Observable} from "rxjs";

@Component({
  selector: 'oh-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {

  loadingState$: Observable<SettingsState> = this.settings.settings$;

  constructor(public settings: SettingsFacade) {
    this.settings.persistLoad(false);
    this.settings.settings$.subscribe(res => {
      console.log(res);
    });
    setTimeout(() => {
      this.settings.persistLoad(true);
    }, 2000);

  }
}
