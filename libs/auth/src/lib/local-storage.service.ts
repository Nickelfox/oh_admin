import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AUTH_FEATURE_KEY } from './+state/auth.reducer';

const APP_PREFIX = 'OH-';

@Injectable()
export class LocalStorageService {

  getAuthToken(): Observable<string | null> {
    const data = localStorage.getItem(`${APP_PREFIX}${AUTH_FEATURE_KEY}-JWT-TOKEN`);
    if (data) {
      return of(data);
    }
    return of(null);
  }

  setAuthToken(tokenString: string): Observable<string | null> {
    try {
      localStorage.setItem(`${APP_PREFIX}${AUTH_FEATURE_KEY}-JWT-TOKEN`, tokenString);
      const data = localStorage.getItem(`${APP_PREFIX}${AUTH_FEATURE_KEY}-JWT-TOKEN`);
      if (data) {
        return of(data);
      }
      return of(null);
    } catch {
      return of(null);
    }
  }

  setItem(key: string, data: never): Observable<never | string | null> {
    try {
      localStorage.setItem(`${APP_PREFIX}${key}`, JSON.stringify(data));
      const newData = localStorage.getItem(`${APP_PREFIX}${key}`);
      return of(newData);
    } catch (e) {
      return of(null);
    }
  }

}
