import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface PackState {};

const initialState: PackState = {};

@Injectable()
export class PackStore extends ComponentStore<PackState> {
  constructor() {
    super(initialState);
  }
}
