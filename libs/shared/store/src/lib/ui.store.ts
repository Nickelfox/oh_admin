import {Injectable} from '@angular/core';
import {ComponentStore} from '@ngrx/component-store';
import {NavItem} from "@hidden-innovation/shared/models";

export interface UiState {
  navItems: NavItem[];
};

const initialState: UiState = {
  navItems: [
    {label: 'Dashboard', path: ''},
  ],
};

@Injectable({providedIn: 'root'})
export class UiStore extends ComponentStore<UiState> {
  readonly navItems$ = this.select(({navItems}) => navItems);

  constructor() {
    super(initialState);
  }
}
