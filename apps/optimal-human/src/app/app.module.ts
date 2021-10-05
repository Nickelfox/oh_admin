import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NxModule } from '@nrwl/angular';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HotToastModule } from '@ngneat/hot-toast';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../environments/environment';
import { AuthGuard, AuthModule, LoggedInGuard } from '@hidden-innovation/auth';
import { ENVIRONMENT } from '@hidden-innovation/environment';
import { MatMenuModule } from '@angular/material/menu';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { MatRippleModule } from '@angular/material/core';
import { PaginatorData } from '@hidden-innovation/user/user-listing';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BreadcrumbModule,
    AuthModule,
    NxModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'reset-password',
        canActivate: [LoggedInGuard],
        loadChildren: () =>
          import('@hidden-innovation/reset-password').then(
            (m) => m.ResetPasswordModule
          ),
        data: { breadcrumb: 'Reset Password' }
      },
      {
        path: 'forgot-password',
        canActivate: [LoggedInGuard],
        loadChildren: () =>
          import('@hidden-innovation/forgot-password').then(
            (m) => m.ForgotPasswordModule
          ),
        data: { breadcrumb: 'Forgot Password' }
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('@hidden-innovation/dashboard').then((m) => m.DashboardModule),
        data: { breadcrumb: 'Dashboard' }
      },
      {
        path: 'change-password',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('@hidden-innovation/change-password').then(
            (m) => m.ChangePasswordModule
          ),
        data: { breadcrumb: 'Change Password' }
      },
      {
        path: 'edit-profile',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('@hidden-innovation/edit-admin-profile').then(
            (m) => m.EditAdminProfileModule
          ),
        data: { breadcrumb: 'Edit Profile' }
      },
      {
        path: 'users',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: `listing/${PaginatorData.pageSize}/${PaginatorData.pageIndex}`
          },
          {
            path: 'listing/:size/:index',
            loadChildren: () =>
              import('@hidden-innovation/user/user-listing').then(
                (m) => m.UserListingModule
              ),
            data: { breadcrumb: 'Users' }
          },
          {
            path: 'details/:id',
            loadChildren: () =>
              import('@hidden-innovation/user/user-details').then(
                (m) => m.UserDetailsModule
              ),
            data: { breadcrumb: 'User Details' }
          }
        ]
      },
      // {
      //   path: 'users/edit/:id',
      //   canActivate: [AuthGuard],
      //   loadChildren: () =>
      //     import('@hidden-innovation/user/user-edit').then(
      //       (m) => m.UserEditModule
      //     ),
      //   data: { breadcrumb: 'User Edit' }
      // },

      { path: '**', redirectTo: '/dashboard' }
    ]),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    HotToastModule.forRoot({
      theme: 'snackbar',
      autoClose: true
    }),
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [{ provide: ENVIRONMENT, useValue: environment }]
})
export class AppModule {
}
