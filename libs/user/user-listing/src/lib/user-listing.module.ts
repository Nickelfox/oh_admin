import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { UserListingComponent } from './user-listing.component';
import { MaterialModule } from '@hidden-innovation/material';
import { Route, RouterModule } from '@angular/router';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { CommonDataFieldStatusModule } from '@hidden-innovation/shared/ui/common-data-field-status';
import { UserDataAccessModule } from '@hidden-innovation/user/data-access';


export const userListingComponent: Route[] = [{
  path: '',
  pathMatch: 'full',
  component: UserListingComponent
}];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    UtilsModule,
    UserDataAccessModule,
    CommonDataFieldStatusModule,
    RouterModule.forChild(userListingComponent)
  ],
  declarations: [UserListingComponent],
  providers: [
    // UserListingStore,
    // UserListingService,
    TitleCasePipe
  ]
})
export class UserListingModule {
}
