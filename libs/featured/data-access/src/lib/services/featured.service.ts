import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { Observable, throwError } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {
  Featured,
  FeaturedCore,
  FeaturedListingResponse,
  FeaturedResponse,
  FeaturedResponseData,
  FeaturedUpdateResponse
} from '../models/featured.interface';

@Injectable()
export class FeaturedService {

  constructor(
    private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment
  ) {
  }

  getFeaturedList(): Observable<Featured[]> {
    return this.http.get<FeaturedListingResponse>(`${this.env.baseURL}/v1/admin/get-all-featured`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  getFeatured(id: number): Observable<FeaturedResponseData> {
    return this.http.get<FeaturedResponse>(`${this.env.baseURL}/v1/admin/get-featured/${id}`).pipe(
      tap(ss => console.log(ss)),
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  updateFeatured(id: number, featured: FeaturedCore): Observable<Featured> {
    return this.http.patch<FeaturedUpdateResponse>(`${this.env.baseURL}/v1/admin/update-featured/${id}`, featured).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }
}
