import { Injectable } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as UserListingActions from './user-listing.actions';
import * as UserListingFeature from './user-listing.reducer';
import * as UserListingSelectors from './user-listing.selectors';

@Injectable()
export class UserListingFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(UserListingSelectors.getUserListingLoaded));
  allUserListing$ = this.store.pipe(
    select(UserListingSelectors.getAllUserListing)
  );
  selectedUserListing$ = this.store.pipe(
    select(UserListingSelectors.getSelected)
  );

  constructor(private readonly store: Store) {}

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(UserListingActions.init());
  }
}
