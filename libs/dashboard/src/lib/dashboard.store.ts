import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface DashboardState {};

const initialState: DashboardState = {};

@Injectable()
export class DashboardStore extends ComponentStore<DashboardState> {
  constructor() {
    super(initialState);
  }
}
