import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {environment} from "../environments/environment";
import {getAppConfigProvider} from "@hidden-innovation/shared/app-config";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule],
  providers: [
    getAppConfigProvider(environment)
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
