import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListingComponent } from './user-listing.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUserListing from './state/user-listing.reducer';
import { UserListingEffects } from './state/user-listing.effects';
import { UserListingFacade } from './state/user-listing.facade';
import { MaterialModule } from '@hidden-innovation/material';
import { Route, RouterModule } from '@angular/router';


export const userListingComponent: Route[] = [{
  path: '',
  pathMatch: 'full',
  component: UserListingComponent,
}];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(userListingComponent),
    StoreModule.forFeature(
      fromUserListing.USER_LISTING_FEATURE_KEY,
      fromUserListing.reducer
    ),
    EffectsModule.forFeature([UserListingEffects]),
  ],
  declarations: [UserListingComponent],
  providers: [UserListingFacade],
})
export class UserListingModule {}
