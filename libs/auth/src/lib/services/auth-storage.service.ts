import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { AUTH_FEATURE_KEY } from '../state/auth.reducer';
import { LoginResponseData } from '../models/auth.interfaces';
import { UserDetails } from '@hidden-innovation/shared/models';

const APP_PREFIX = 'OH-';

@Injectable()
export class AuthStorageService {

  private readonly adminStorageKey = `${APP_PREFIX}${AUTH_FEATURE_KEY}-ADMIN`;
  private readonly authStorageKey = `${APP_PREFIX}${AUTH_FEATURE_KEY}-AUTH-TOKEN`;

  //User State Method
  setAuthAdmin(admin: Partial<UserDetails>): Observable<UserDetails | null> {
    try {
      localStorage.setItem(this.adminStorageKey, JSON.stringify(admin));
      const data = localStorage.getItem(this.adminStorageKey);
      if (data) {
        return of(JSON.parse(data) as UserDetails);
      }
      return of(null);
    } catch {
      return of(null);
    }
  }

  getAuthAdmin(): Observable<LoginResponseData> {
    const adminData = localStorage.getItem(this.adminStorageKey);
    const token = localStorage.getItem(this.authStorageKey);
    if (adminData && token) {
      return of({
        admin: JSON.parse(adminData),
        token
      });
    }
    return throwError(null);
  }

  //Token Method
  setAuthToken(token: string): Observable<string | null> {
    try {
      localStorage.setItem(this.authStorageKey, token);
      const data = localStorage.getItem(this.authStorageKey);
      if (data) {
        return of(data);
      }
      return of(null);
    } catch {
      return of(null);
    }
  }

  getAuthToken(): Observable<string> {
    const data = localStorage.getItem(this.authStorageKey);
    if (data) {
      return of(data);
    }
    return throwError(null);
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
    localStorage.removeItem(this.adminStorageKey);
    localStorage.removeItem(this.authStorageKey);
  }

}
