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
    super({
      isLoading: false,
      navData: [
        {
          name: 'DashBoard',
          navItems: [
            { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' }
          ]
        },
        {
          name: 'Tests',
          navItems: [
            { label: 'Tests', path: '/tests', icon: 'timer' }
          ]
        },
        {
          name: 'Assessments',
          navItems: [
            { label: 'Assessments', path: '/assessments', icon: 'timeline' }
          ]
        },
        {
          name: 'Questionnaires',
          navItems: [
            { label: 'Questionnaires', path: '/questionnaire', icon: 'comment' }
          ]
        },
        {
          name: 'Packs',
          navItems: [
            { label: 'Packs', path: '/packs', icon: 'collections' }
          ]
        },
        {
          name: 'Featured',
          navItems: [
            { label: 'Featured', path: '/featured', icon: 'star' }
          ]
        },
        {
          name: 'Tags',
          navItems: [
            { label: 'Tags', path: '/tags', icon: 'style' }
          ]
        },
        {
          name: 'Admin',
          navItems: [
            {
              label: 'Users',
              path: `/users`,
              icon: 'supervisor_account'
            },
            { label: 'Reports', path: '/reports', icon: 'show_chart' },
            { label: 'App Releases', path: '/app-release', icon: 'file_download' }
          ]
        }
      ]
    });
  }
}
