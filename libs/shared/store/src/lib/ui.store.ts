import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { NavItem } from '@hidden-innovation/shared/models';
import { tap } from 'rxjs/operators';

export interface UiState {
  navData: {
    name: string;
    navItems: NavItem[]
  }[];
  isLoading: boolean;
}

const initialState: UiState = {
  isLoading: false,
  navData: [
    {
      name: 'DashBoard',
      navItems: [
        { label: 'Dashboard', path: '/dashboard' }
      ]
    },
    {
      name: 'Admin',
      navItems: [
        { label: 'Users', path: '/users/listing/1' }
      ]
    },
    {
      name: 'Content',
      navItems: [
        { label: 'Tests', path: '/tests' },
        { label: 'Test Groups', path: '/test-group' },
        { label: 'Packs', path: '/packs' },
        { label: 'Categories', path: '/categories' },
        { label: 'Assessments', path: '/assessments' }
      ]
    },
    {
      name: 'Reports',
      navItems: [
        { label: 'Reports', path: '/users' }
      ]
    },
    {
      name: 'App Releases',
      navItems: [
        { label: 'App Releases', path: '/app-release' }
      ]
    }
  ]
};

@Injectable({ providedIn: 'root' })
export class UiStore extends ComponentStore<UiState> {
  readonly navItems$ = this.select(({ navData }) => navData);
  readonly isLoading$ = this.select(({ isLoading }) => isLoading);

  toggleGlobalLoading = this.effect<boolean>(origin$ =>
    origin$.pipe(
      tap((input) => {
        this.patchState({
          isLoading: !!input
        });
      })
    )
  );

  constructor() {
    super(initialState);
  }
}
