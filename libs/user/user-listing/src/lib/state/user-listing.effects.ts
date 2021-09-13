import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as UserListingActions from './user-listing.actions';
import * as UserListingFeature from './user-listing.reducer';

@Injectable()
export class UserListingEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserListingActions.init),
      fetch({
        run: (action) => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return UserListingActions.loadUserListingSuccess({ userListing: [] });
        },
        onError: (action, error) => {
          console.error('Error', error);
          return UserListingActions.loadUserListingFailure({ error });
        },
      })
    )
  );

  constructor(private readonly actions$: Actions) {}
}
