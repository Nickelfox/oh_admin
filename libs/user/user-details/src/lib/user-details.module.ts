import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details.component';
import { MaterialModule } from '@hidden-innovation/material';
import { Route, RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUserDetails from './state/user-details.reducer';
import { UserDetailsEffects } from './state/user-details.effects';
import { UserDetailsFacade } from './state/user-details.facade';

export const userDetailComponent: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: UserDetailsComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(userDetailComponent),
    StoreModule.forFeature(
      fromUserDetails.USER_DETAILS_FEATURE_KEY,
      fromUserDetails.reducer
    ),
    EffectsModule.forFeature([UserDetailsEffects]),
  ],
  declarations: [UserDetailsComponent],
  providers: [UserDetailsFacade],
})
export class UserDetailsModule {}
