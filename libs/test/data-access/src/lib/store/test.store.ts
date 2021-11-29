import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface TestState {};

const initialState: TestState = {};

@Injectable()
export class TestStore extends ComponentStore<TestState> {
  constructor() {
    super(initialState);
  }
}
