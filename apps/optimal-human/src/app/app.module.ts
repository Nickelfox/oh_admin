import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from "../environments/environment";
import {getAppConfigProvider} from "@hidden-innovation/shared/app-config";
import {HttpClientModule} from "@angular/common/http";
import {WebShellModule} from "@hidden-innovation/shell/feature";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    WebShellModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    getAppConfigProvider(environment)
  ],
})
export class AppModule {}
