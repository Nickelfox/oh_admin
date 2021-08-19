import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {HotToastService} from '@ngneat/hot-toast';

import * as AuthSelectors from './auth.selectors';
import * as AuthActions from './auth.actions';
import { LoginRequest } from '../models';

@Injectable()
export class AuthFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loggedIn$ = this.store.pipe(select(AuthSelectors.getLoggedIn));
  token$ = this.store.pipe(select(AuthSelectors.getToken));
  isLoading$ = this.store.pipe(select(AuthSelectors.getLoadingState));

  constructor(private readonly store: Store,
              private toast: HotToastService) {
    this.init();
  }

  init() {
    this.store.dispatch(AuthActions.checkLogin());
  }

  login(loginObj: LoginRequest) {
    this.toast.loading('Loading..', {
      role: 'status'
    });
    this.store.dispatch(AuthActions.login(loginObj));
  }
}
