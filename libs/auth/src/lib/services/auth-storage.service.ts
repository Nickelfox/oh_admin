import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {AUTH_FEATURE_KEY} from "../state";

const APP_PREFIX = 'OH-';

@Injectable()
export class AuthStorageService {

  private readonly authStorageKey = `${APP_PREFIX}${AUTH_FEATURE_KEY}-JWT-TOKEN`;

  getAuthToken(): Observable<string | null> {
    const data = localStorage.getItem(this.authStorageKey);
    if (data) {
      return of(data);
    }
    return throwError(null);
  }

  setAuthToken(tokenString: string): Observable<string | null> {
    try {
      localStorage.setItem(this.authStorageKey, tokenString);
      const data = localStorage.getItem(this.authStorageKey);
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

  clearStorage(): void {
    localStorage.removeItem(this.authStorageKey);
  }

}
