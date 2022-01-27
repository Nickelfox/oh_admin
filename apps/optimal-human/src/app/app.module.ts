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
import { paginatorData } from '@hidden-innovation/user/data-access';
import {FeaturedNameEnum, OperationTypeEnum} from '@hidden-innovation/shared/models';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { TitleCasePipe } from '@angular/common';

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
            redirectTo: `listing/${paginatorData.pageSize}/${paginatorData.pageIndex}`
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
      {
        path: 'questionnaire',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: `listing/${paginatorData.pageSize}/${paginatorData.pageIndex}`
          },
          {
            path: 'listing/:size/:index',
            loadChildren: () =>
              import('@hidden-innovation/questionnaire/questionnaire-listing').then(
                (m) => m.QuestionnaireListingModule
              ),
            data: { breadcrumb: 'Questionnaires' }
          },
          {
            path: 'create',
            loadChildren: () =>
              import('@hidden-innovation/questionnaire/create-questionnaire').then(
                (m) => m.CreateQuestionnaireModule
              ),
            data: { breadcrumb: 'Create Questionnaire', type: OperationTypeEnum.CREATE }
          },
          {
            path: 'edit/:id',
            loadChildren: () =>
              import('@hidden-innovation/questionnaire/create-questionnaire').then(
                (m) => m.CreateQuestionnaireModule
              ),
            data: { breadcrumb: 'Edit Questionnaire', type: OperationTypeEnum.EDIT }
          }
        ]
      },
      {
        path: 'tags',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: `listing/${paginatorData.pageSize}/${paginatorData.pageIndex}`
          },
          {
            path: 'listing/:size/:index',
            loadChildren: () =>
              import('@hidden-innovation/tags/tags').then(
                (m) => m.TagsModule
              ),
            data: { breadcrumb: 'Tags' }
          }
        ]
      },
      {
        path: 'tests-group',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: `listing/${paginatorData.pageSize}/${paginatorData.pageIndex}`
          },
          {
            path: 'listing/:size/:index',
            loadChildren: () =>
              import('@hidden-innovation/test-group/test-group-listing').then(
                (m) => m.TestGroupListingModule
              ),
            data: { breadcrumb: 'Tests Group' }
          },
          {
            path: 'create',
            loadChildren: () =>
              import('@hidden-innovation/test-group/test-group-create').then(
                (m) => m.TestGroupCreateModule
              ),
            data: { breadcrumb: 'Add Test Group', type: OperationTypeEnum.CREATE }
          },
          {
            path: 'edit/:id',
            loadChildren: () =>
              import('@hidden-innovation/test-group/test-group-create').then(
                (m) => m.TestGroupCreateModule
              ),
            data: { breadcrumb: 'Edit Test Group', type: OperationTypeEnum.EDIT }
          }
        ]
      },
      {
        path: 'tests',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: `listing/${paginatorData.pageSizeOptions[3]}/${paginatorData.pageIndex}`
          },
          {
            path: 'listing/:size/:index',
            loadChildren: () =>
              import('@hidden-innovation/test/test-listing').then(
                (m) => m.TestListingModule
              ),
            data: { breadcrumb: 'Tests' }
          },
          {
            path: 'create',
            loadChildren: () =>
              import('@hidden-innovation/test/test-create').then(
                (m) => m.TestCreateModule
              ),
            data: { breadcrumb: 'Add Test', type: OperationTypeEnum.CREATE }
          },
          {
            path: 'edit/:id',
            loadChildren: () =>
              import('@hidden-innovation/test/test-create').then(
                (m) => m.TestCreateModule
              ),
            data: { breadcrumb: 'Edit Test', type: OperationTypeEnum.EDIT }
          }
        ]
      },
      {
        path: 'packs',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: `listing/${paginatorData.pageSize}/${paginatorData.pageIndex}`
          },
          {
            path: 'listing/:size/:index',
            loadChildren: () =>
              import('@hidden-innovation/pack/pack-listing').then(
                (m) => m.PackListingModule
              ),
            data: { breadcrumb: 'Packs' }
          },
          {
            path: 'create',
            loadChildren: () =>
              import('@hidden-innovation/pack/pack-create').then(
                (m) => m.PackCreateModule
              ),
            data: { breadcrumb: 'Add Pack', type: OperationTypeEnum.CREATE }
          },
          {
            path: 'edit/:id',
            loadChildren: () =>
              import('@hidden-innovation/pack/pack-create').then(
                (m) => m.PackCreateModule
              ),
            data: { breadcrumb: 'Edit Pack', type: OperationTypeEnum.EDIT }
          }
        ]
      },
      {
        path: 'assessments',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: `listing/${paginatorData.pageSize}/${paginatorData.pageIndex}`
          },
          {
            path: 'listing/:size/:index',
            loadChildren: () =>
              import('@hidden-innovation/assessment/assessment-listing').then(
                (m) => m.AssessmentListingModule
              ),
            data: { breadcrumb: 'Assessments' }
          },
          {
            path: 'create',
            loadChildren: () =>
              import('@hidden-innovation/assessment/assessment-create').then(
                (m) => m.AssessmentCreateModule
              ),
            data: { breadcrumb: 'Add Assessment'}
          }
        ]
      },
      {
        path: 'featured',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: `listing/${paginatorData.pageSize}/${paginatorData.pageIndex}`
          },
          {
            path: 'listing/:size/:index',
            loadChildren: () =>
              import('@hidden-innovation/featured/featured-listing').then(
                (m) => m.FeaturedListingModule
              ),
            data: { breadcrumb: 'Featured' }
          },
          {
            path: `edit/:id`,
            loadChildren: () =>
              import('@hidden-innovation/featured/create-featured').then(
                (m) => m.CreateFeaturedModule
              ),
            data: { breadcrumb: 'Edit Featured' }
          },
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
    ], {
      paramsInheritanceStrategy: 'always'
    }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    HotToastModule.forRoot({
      theme: 'snackbar',
      position: 'bottom-right',
      autoClose: true,
      duration: 3000
    }),
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    MatTabsModule,
    MatCardModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [{ provide: ENVIRONMENT, useValue: environment }, TitleCasePipe]
})
export class AppModule {
}
