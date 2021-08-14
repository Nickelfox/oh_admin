import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as AuthSelectors from './auth.selectors';
import * as AuthActions from './auth.actions';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable()
export class AuthFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loggedIn$ = this.store.pipe(select(AuthSelectors.getLoggedIn));
  allAuth$ = this.store.pipe(select(AuthSelectors.getAuthState));
  token$ = this.store.pipe(select(AuthSelectors.getToken));
  isLoading$ = this.store.pipe(select(AuthSelectors.getLoadingState));

  constructor(private readonly store: Store,
              private toast: HotToastService) {
  }

  login(email: string, password: string) {
    this.toast.loading('Loading..', {
      role: 'status'
    });
    this.store.dispatch(AuthActions.login({ email, password }));
  }
}
