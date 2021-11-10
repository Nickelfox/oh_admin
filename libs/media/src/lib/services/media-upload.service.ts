import { Inject, Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { Observable } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { MediaUpload, MediaUploadResponse } from '../models/media.interface';
import { DateTime } from 'luxon';
import { AuthFacade } from '@hidden-innovation/auth';

@Injectable()
export class MediaUploadService {

  private httpClient: HttpClient;

  constructor(
    private authFacade: AuthFacade,
    private handler: HttpBackend,
    @Inject(ENVIRONMENT) private env: Environment) {
    this.httpClient = new HttpClient(handler);
  }

  uploadMedia(file: Blob, token?: string): Observable<MediaUpload> {
    const formData: FormData = new FormData();
    formData.append('file', file, `image-${DateTime.now().toISOTime()}`);
    return this.httpClient.post<MediaUploadResponse>(`${this.env.baseURL}/v1/users/upload`, formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      map(res => res.data)
    );
  }

}
