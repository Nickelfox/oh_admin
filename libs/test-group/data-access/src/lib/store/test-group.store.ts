import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface TestGroupState {};

const initialState: TestGroupState = {};

@Injectable()
export class TestGroupStore extends ComponentStore<TestGroupState> {
  constructor() {
    super(initialState);
  }
}
