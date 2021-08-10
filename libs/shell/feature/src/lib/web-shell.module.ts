import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {LayoutComponent, WebLayoutModule} from "@hidden-innovation/shell/ui/layout";
import {SettingsModule} from "@hidden-innovation/settings/feature";

@NgModule({
  imports: [
    CommonModule,
    WebLayoutModule,
    RouterModule.forRoot([{
      path: '',
      component: LayoutComponent
    }], {
      scrollPositionRestoration: 'top',
    }),
    StoreModule.forRoot(
      {},
      {
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }
    ),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    }),
    StoreRouterConnectingModule.forRoot(),
    SettingsModule
  ],
  exports: [RouterModule],
  providers: [],
})
export class WebShellModule {
}
