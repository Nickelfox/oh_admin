import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([], {
      scrollPositionRestoration: "top"
    }),
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class FeatureModule {
}
