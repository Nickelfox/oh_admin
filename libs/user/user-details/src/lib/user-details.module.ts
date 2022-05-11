import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { UserDetailsComponent } from './user-details.component';
import { MaterialModule } from '@hidden-innovation/material';
import { Route, RouterModule } from '@angular/router';
import { SpinnerTextModule } from '@hidden-innovation/shared/ui/spinner-text';
import { CommonDataFieldModule } from '@hidden-innovation/shared/ui/common-data-field';
import { CommonDataFieldSkeletonModule } from '@hidden-innovation/shared/ui/common-data-field-skeleton';
import { CommonDataFieldStatusModule } from '@hidden-innovation/shared/ui/common-data-field-status';
import { UserDataAccessModule } from '@hidden-innovation/user/data-access';

export const userDetailComponent: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: UserDetailsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SpinnerTextModule,
    UserDataAccessModule,
    CommonDataFieldModule,
    CommonDataFieldSkeletonModule,
    CommonDataFieldStatusModule,
    RouterModule.forChild(userDetailComponent)
  ],
  declarations: [UserDetailsComponent],
  providers: [
    // UserDetailsService,
    // UserDetailsStore,
    TitleCasePipe
  ]
})
export class UserDetailsModule {
}
