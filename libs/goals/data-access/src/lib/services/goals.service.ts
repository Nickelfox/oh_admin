import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { Observable, throwError } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import { FeaturedResponse, FeaturedResponseData } from '@hidden-innovation/featured/data-access';

@Injectable()
export class GoalsService {

  constructor(
    private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment
  ) {
  }

  getFeatured(id: number): Observable<FeaturedResponseData> {
    return this.http.get<FeaturedResponse>(`${this.env.baseURL}/v1/admin/get-featured/${id}`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
