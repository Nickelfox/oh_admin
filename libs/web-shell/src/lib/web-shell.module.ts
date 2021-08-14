import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from "@angular/platform-browser";
import {NxModule} from "@nrwl/angular";
import {RouterModule} from "@angular/router";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {environment} from "../../../../apps/optimal-human/src/environments/environment";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {WebLayoutComponent} from './web-layout.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    NxModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        component: WebLayoutComponent
      }
    ]),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    // TODO Implement NgRx Router and Error Handler module
  ],
  declarations: [
    WebLayoutComponent
  ],
  exports: [
    WebLayoutComponent,
    RouterModule
  ]
})
export class WebShellModule {
}
