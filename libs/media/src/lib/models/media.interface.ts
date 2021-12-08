import { CustomApiResponse } from '@hidden-innovation/shared/models';

export interface MediaUpload {
  attachmentId: number;
}

export interface MediaUploadResponse extends CustomApiResponse {
  data: MediaUpload;
}

export interface ImageCropperReq {
  file: File;
  aspectRatio: 'cube' | 'wide';
  round: boolean;
}

export interface ImageCropperResponseData extends MediaUpload {
  croppedImage: any;
  fileName: string;
}

export interface Media {
  id: number;
  type: string;
  fileName: string;
  path: string;
  deletedAt: string;
  url: string;
}