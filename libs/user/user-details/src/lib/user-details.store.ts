import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { UserDetails } from '@hidden-innovation/shared/models';
import { EMPTY, Observable } from 'rxjs';
import { catchError, exhaustMap, tap } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { UserDetailsService } from './services/user-details.service';

export interface UserDetailsState extends Partial<UserDetails> {
  isLoading?: boolean;
}

const initialState: UserDetailsState = {
  isLoading: false,
};

@Injectable()
export class UserDetailsStore extends ComponentStore<UserDetailsState> {

  readonly isLoading$: Observable<boolean> = this.select(state => !!state.isLoading);

  getUserDetails = this.effect<{ id: number }>(params$ =>
    params$.pipe(
      tap(() => {
        this.patchState({
          isLoading: true
        });
      }),
      exhaustMap(({ id }) =>
        this.userDetailsService.getUserDetails(id ?? 0).pipe(
          tap(
            (user) => {
              this.patchState({
                isLoading: false,
                email: user.email,
                id: user.id,
                role: user.role,
                username: user.username,
                name: user.name,
                updated_at: user.updated_at,
                created_at: user.created_at,
                language: user.language,
                skinColor: user.skinColor,
                height: user.height,
                age: user.age,
                gender: user.gender,
                video: user.video,
                status: user.status,
                weight: user.weight,
              });
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
