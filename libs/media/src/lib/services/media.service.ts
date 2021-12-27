import { Inject, Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MediaUpload, MediaUploadResponse } from '../models/media.interface';
import { AuthFacade } from '@hidden-innovation/auth';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';

@Injectable()
export class MediaService {

  private httpClient: HttpClient;

  constructor(
    private authFacade: AuthFacade,
    private handler: HttpBackend,
    private constantDataService: ConstantDataService,
    @Inject(ENVIRONMENT) private env: Environment) {
    this.httpClient = new HttpClient(handler);
  }

  uploadMedia(file: Blob | File, fileName: string, token?: string): Observable<MediaUpload> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    formData.append('type', file.type.split('/')[0]);
    return this.httpClient.post<MediaUploadResponse>(`${this.env.baseURL}/v1/users/upload`, formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      map(res => res.data)
    );
  }

  removeExtension(filename: string): string {
    const lastDotPosition = filename.lastIndexOf('.');
    if (lastDotPosition === -1) return filename;
    else return filename.substr(0, lastDotPosition);
  }

  getFileIcon(file: File): string {
    switch (file.type.split('/')[0]) {
      case this.constantDataService.FILE_FORMAT_DATA.audio:
        return 'audio_file';
      case this.constantDataService.FILE_FORMAT_DATA.video:
        return 'video_file';
      case this.constantDataService.FILE_FORMAT_DATA.image:
        return 'image';
      case this.constantDataService.FILE_FORMAT_DATA.text:
        return 'description';
      default:
        return 'attach_file';
    }
  }

}
