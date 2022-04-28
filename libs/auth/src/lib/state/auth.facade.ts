import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as AuthSelectors from './auth.selectors';
import * as AuthActions from './auth.actions';
import { LoginRequest } from '../models/auth.interfaces';
import { UserDetails } from '@hidden-innovation/shared/models';
import { fromEvent, Observable } from 'rxjs';
import { delay, filter } from 'rxjs/operators';

@Injectable()
export class AuthFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loggedIn$ = this.store.pipe(select(AuthSelectors.getLoggedIn));
  token$ = this.store.pipe(select(AuthSelectors.getToken));
  authAdmin$ = this.store.pipe(select(AuthSelectors.getAuthAdmin));
  isLoginLoading$ = this.store.pipe(select(AuthSelectors.getLoginLoadingState));
  source$?: Observable<Event>;

  constructor(private readonly store: Store) {
    this.init();
  }

  init() {
    this.store.dispatch(AuthActions.checkLogin());
  }

  login(loginObj: LoginRequest) {
    this.store.dispatch(AuthActions.login(loginObj));
  }

  logoutLocal() {

    this.store.dispatch(AuthActions.logoutLocal());
  }

  updateAdminAuth(adminObj: UserDetails) {
    this.store.dispatch(AuthActions.adminUpdate(adminObj));
  }

  check() {
    this.source$ = fromEvent(window, 'storage');
    this.source$.subscribe(_ =>{
      const action = localStorage.getItem('OH-AUTH-ADMIN');
        if (!action) {
          this.store.dispatch(AuthActions.logoutLocal());
        }
        else {
          this.store.dispatch(AuthActions.checkLogin());
        }
    }
    )
  }
}
