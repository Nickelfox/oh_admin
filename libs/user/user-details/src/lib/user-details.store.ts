import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { UserDetails } from '@hidden-innovation/shared/models';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { UserDetailsService } from './services/user-details.service';

export interface UserDetailsState extends Partial<UserDetails> {
  isLoading?: boolean;
}

const initialState: UserDetailsState = {
  isLoading: false
};

@Injectable()
export class UserDetailsStore extends ComponentStore<UserDetailsState> {

  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);

  readonly updateState$ = this.updater<UserDetailsState, UserDetails>(({ isLoading }, user) => ({ isLoading, ...user }));

  getUserDetails$ = this.effect<{ id: number }>(params$ =>
    params$.pipe(
      tap(() => {
        this.patchState({
          isLoading: true
        });
      }),
      switchMap(({ id }) =>
        this.userDetailsService.getUserDetails(id ?? 0).pipe(
          tapResponse(
            (user) => {
              this.patchState({
                isLoading: false
              });
              this.updateState$(user);
            },
            (_) => {
              this.patchState({
                isLoading: false
              });
            }
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private hotToastService: HotToastService,
    private router: Router,
    private userDetailsService: UserDetailsService
  ) {
    super(initialState);
  }
}
