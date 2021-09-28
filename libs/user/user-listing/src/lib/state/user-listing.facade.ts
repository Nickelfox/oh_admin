import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as UserListActions from './user-listing.actions';
import * as UserListSelectors from './user-listing.selectors';
import { UserListingRequest } from '../models/user-listing.interface';

@Injectable()
export class UserListingFacade {

  isListLoading$ = this.store.pipe(select(UserListSelectors.isLoading));
  users$ = this.store.pipe(select(UserListSelectors.getUsersList));
  count$ = this.store.pipe(select(UserListSelectors.getUsersCount));

  constructor(private readonly store: Store) {
  }

  init(reqObj: UserListingRequest) {
    this.store.dispatch(UserListActions.getList(reqObj));
  }

  setListData(pageData: UserListingRequest) {
    this.store.dispatch(UserListActions.setListPage(pageData));
  }
}
