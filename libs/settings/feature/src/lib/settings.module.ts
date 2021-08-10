import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {
  SETTINGS_FEATURE_KEY,
  SettingsEffects,
  SettingsFacade,
  settingsReducer
} from "@hidden-innovation/settings/data-access";

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(SETTINGS_FEATURE_KEY, settingsReducer),
    EffectsModule.forFeature([SettingsEffects]),
  ],
  providers: [SettingsFacade]
})
export class SettingsModule {
}
