import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {AUTH_FEATURE_KEY, AuthEffects, AuthFacade, authReducer} from "./state";
import {ErrorInterceptor, TokenInterceptor} from "./interceptors";
import {AuthGuard, LoggedInGuard} from "./guards";
import {AuthService, AuthStorageService} from "./services";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(AUTH_FEATURE_KEY, authReducer),
    EffectsModule.forFeature([AuthEffects]),
    MatButtonModule,
  ],
  providers: [
    AuthFacade,
    AuthStorageService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    AuthGuard,
    LoggedInGuard,
  ],
  declarations: []
})
export class AuthModule {
}
