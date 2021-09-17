import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as UserDetailsActions from './user-details.actions';
import * as UserDetailsSelectors from './user-details.selectors';

@Injectable()
export class UserDetailsFacade {

  isDetailsLoading$ = this.store.pipe(select(UserDetailsSelectors.isLoading));
  userDetails$ = this.store.pipe(select(UserDetailsSelectors.getUserDetailsState));

  constructor(private readonly store: Store) {
  }
  
  init(id: number) {
    this.store.dispatch(UserDetailsActions.getUserDetails({ id }));
  }
}
