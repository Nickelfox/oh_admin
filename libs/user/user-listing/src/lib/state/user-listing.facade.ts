import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as UserListActions from './user-listing.actions';
import * as UserListSelectors from './user-listing.selectors';
import { UserListingRequest } from '../models/user-listing.interface';

@Injectable()
export class UserListingFacade {

  isListLoaded$ = this.store.pipe(select(UserListSelectors.isLoaded));
  isListLoading$ = this.store.pipe(select(UserListSelectors.isLoading));
  users$ = this.store.pipe(select(UserListSelectors.getUsersList));
  count$ = this.store.pipe(select(UserListSelectors.getUsersCount));

  constructor(private readonly store: Store) {
  }

  getList(pageData: UserListingRequest) {
    this.store.dispatch(UserListActions.getList({
      limit: pageData.limit,
      page: pageData.page
    }));
  };
}
