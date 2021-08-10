import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Route, RouterModule} from '@angular/router';
import {LayoutComponent} from "./layout.component";
import {StoreModule} from "@ngrx/store";

export const layoutRoutes: Route[] = [];

@NgModule({
  imports: [CommonModule, RouterModule, StoreModule],
  declarations: [
    LayoutComponent
  ],
  exports: [
    LayoutComponent
  ]
})
export class WebLayoutModule {
}
