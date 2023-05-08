import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Environment, ENVIRONMENT} from '@hidden-innovation/environment';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {
  Featured,
  FeaturedCore,
  FeaturedListingResponse,
  FeaturedResponse,
  FeaturedResponseData,
  FeaturedUpdateResponse
} from '../models/featured.interface';
import {OrderedContent, PackContentTypeEnum} from "@hidden-innovation/shared/models";

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
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  updateFeatured(id: number, featured: FeaturedCore): Observable<Featured> {

    return this.http.patch<FeaturedUpdateResponse>(`${this.env.baseURL}/v1/admin/update-featured/${id}`, featured.name === "FEATURED" && featured.location === "HOME" ? this.getNewPayload(featured) : featured).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  getNewPayload(features: FeaturedCore) {
    const testIds: OrderedContent[] = []
    const testGroupIds: OrderedContent[] = []
    const questionnaireIds: OrderedContent[] = []
    const packIds: OrderedContent[] = []
    const payload = {
      location: features.location,
      name: features.name,
      content: features.content
    }
    features.content.map((items) => {
      switch (items.type) {
        case PackContentTypeEnum.SINGLE:
          testIds.push({id: items.contentId ?? 0, order: items.order ?? 0})
          break
        case PackContentTypeEnum.GROUP:
          testGroupIds.push({id: items.contentId ?? 0, order: items.order ?? 0})
          break
        case PackContentTypeEnum.QUESTIONNAIRE:
          questionnaireIds.push({id: items.contentId ?? 0, order: items.order ?? 0})
          break
        case PackContentTypeEnum.PACK:
          questionnaireIds.push({id: items.contentId ?? 0, order: items.order ?? 0})
          break
        default:
          break
      }
    })
    return ({
      ...payload,
      singleTestIds: testIds,
      testGroupIds: testGroupIds,
      questionnaireIds: questionnaireIds,
      packIds: packIds
    })
  }
}
