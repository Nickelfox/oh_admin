import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from '@hidden-innovation/auth';
import { CommonModule } from '@angular/common';
import { NxModule } from '@nrwl/angular';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HotToastModule } from '@ngneat/hot-toast';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AuthModule,
    CommonModule,
    BrowserModule,
    NxModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        component: AppComponent
      }
    ]),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    HotToastModule.forRoot({
      theme: 'snackbar',
      autoClose: false
    }),
    MatButtonModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule {
}
