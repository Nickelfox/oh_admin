import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Environment, ENVIRONMENT} from "@hidden-innovation/environment";
import {Observable, throwError} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import {
  Featured, FeaturedExtended,
  FeaturedListingFilters,
  FeaturedListingResponse, FeaturedResponse
} from "../models/featured.interface";

@Injectable()
export class FeaturedService {

  constructor(
    private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment
  ) {
  }

  getFeaturedList(reqObj: FeaturedListingFilters): Observable<Featured[]> {
    let params = new HttpParams();

    if (reqObj.dateSort) {
      params = params.append('dateSort', reqObj.dateSort);
    }


    return this.http.get<FeaturedListingResponse>(`${this.env.baseURL}/v1/admin/get-all-featured`, { params }).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err)),

    );
  }

  getFeatured(id:number): Observable<FeaturedExtended>{
    return this.http.get<FeaturedResponse>(`${this.env.baseURL}/v1/admin/get-featured/${id}`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err)),
    );
}
}
