import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AUTH_FEATURE_KEY, authReducer} from "./state/auth.reducer";
import {ErrorInterceptor} from "./interceptors/error.interceptor";
import {LoggedInGuard} from "./guards/logged-in-guard.service";
import {AuthFacade} from "./state/auth.facade";
import {AuthService} from "./services/auth.service";
import {AuthEffects} from "./state/auth.effects";
import {TokenInterceptor} from "./interceptors/token.interceptor";
import {AuthGuard} from "./guards/auth.guard";
import {AuthStorageService} from "./services/auth-storage.service";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {MaterialModule} from "@hidden-innovation/material";
import {AuthLayoutModule} from "@hidden-innovation/shared/ui/auth-layout";

@NgModule({

  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    AuthLayoutModule,
    RouterModule.forChild([
      {
        path: 'login',
        component: LoginComponent,
      }
    ]),
    StoreModule.forFeature(AUTH_FEATURE_KEY, authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  providers: [
    AuthFacade,
    AuthEffects,
    AuthStorageService,
    AuthService,
    TokenInterceptor,
    ErrorInterceptor,
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
  declarations: [LoginComponent]
})
export class AuthModule {
}
