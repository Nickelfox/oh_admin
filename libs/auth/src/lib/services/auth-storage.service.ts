import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { AUTH_FEATURE_KEY } from '../state/auth.reducer';
import { AdminAuthDetails, LoginResponseData } from '../models/auth.interfaces';

const APP_PREFIX = 'OH-';

@Injectable()
export class AuthStorageService {

  private readonly authStorageKey = `${APP_PREFIX}${AUTH_FEATURE_KEY}-JWT-TOKEN`;
  private readonly adminStorageKey = `${APP_PREFIX}${AUTH_FEATURE_KEY}-ADMIN`;

  //User State Method
  setAuthAdmin(admin: Partial<LoginResponseData>): Observable<LoginResponseData | null> {
    try {
      localStorage.setItem(this.adminStorageKey, JSON.stringify(admin));
      const data = localStorage.getItem(this.adminStorageKey);
      if (data) {
        return of(JSON.parse(data) as LoginResponseData);
      }
      return of(null);
    } catch {
      return of(null);
    }
  }

  getAuthAdmin(): Observable<LoginResponseData> {
    const data = localStorage.getItem(this.adminStorageKey);
    if (data) {
      return of(JSON.parse(data) as LoginResponseData);
    }
    return throwError(null);
  }

  // Token Method
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

  clearAuthStorage() {
    localStorage.removeItem(this.authStorageKey);
  }

}
