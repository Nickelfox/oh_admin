import { Inject, Injectable } from '@angular/core';
import {
  Pack,
  PackContentListingRequest,
  PackContentListingResponse,
  PackContentListingResponseData,
  PackCore,
  PackDetailsResponse,
  PackListingRequest,
  PackListingResponse,
  PackListingResponseData,
  PackMutationResponse
} from '../models/pack.interface';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  getPacks(reqObj: PackListingRequest): Observable<PackListingResponseData> {
    let params = new HttpParams();
    params = params.appendAll({
      'page': reqObj.page.toString(),
      'limit': reqObj.limit.toString()
    });
    if (reqObj.nameSort) {
      params = params.append('nameSort', reqObj.nameSort);
    }
    if (reqObj.dateSort) {
      params = params.append('dateSort', reqObj.dateSort);
    }
    if (reqObj.published !== undefined && reqObj.published !== null) {
      params = params.append('published', reqObj.published);
    }
    if (reqObj.search && reqObj.search?.length) {
      params = params.append('search', reqObj.search);
    }
    return this.http.get<PackListingResponse>(`${this.env.baseURL}/v1/admin/get-all-pack`, { params }).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  createPack(obj: PackCore): Observable<Pack> {
    return this.http.post<PackMutationResponse>(`${this.env.baseURL}/v1/admin/create-pack-new`, obj).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  getContentPack(reqObj: PackContentListingRequest): Observable<PackContentListingResponseData> {
    let params = new HttpParams();
    params = params.appendAll({
      'page': reqObj.page.toString(),
      'limit': reqObj.limit.toString()
    });
    return this.http.get<PackContentListingResponse>(`${this.env.baseURL}/v1/admin/combined-pack`, { params }).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  getPackDetails(id: number): Observable<Pack> {
    return this.http.get<PackDetailsResponse>(`${this.env.baseURL}/v1/admin/get-pack-new/${id}`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  updatePackDetails(id: number, reqObj: PackCore): Observable<Pack> {
    return this.http.patch<PackMutationResponse>(`${this.env.baseURL}/v1/admin/update-pack-new/${id}`, reqObj).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
