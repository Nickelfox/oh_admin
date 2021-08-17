import {InjectionToken, ValueProvider} from '@angular/core';
import {AppConfig} from '..';

export const APP_CONFIG = new InjectionToken<AppConfig>('hidden-innovation.config');

export const getAppConfigProvider = (value: AppConfig): ValueProvider => ({
  provide: APP_CONFIG,
  useValue: value
});
