import { Media } from '@hidden-innovation/media';
import { Test } from '@hidden-innovation/test/data-access';
import { Lesson } from './lesson.interface';
import { CustomApiResponse, SortingEnum } from '@hidden-innovation/shared/models';

export interface Pack {
  id: number;
  name: string;
  description: string;
  posterId: number;
  thumbnailId: number;
  imageId: number;
  isPublished: boolean;
  lessons: Lesson[];
  tests: Test[];
  image: Media;
  thumbnail: Media;
  poster: Media;
  deleted_at: string;
  created_at: string;
  updated_at: string;
}

export interface PackListingFilters {
  dateSort: SortingEnum | undefined;
  nameSort: SortingEnum | undefined;
  published: 'TRUE' | 'FALSE' | undefined;
  search: string | undefined;
}

export interface PackListingRequest extends PackListingFilters {
  limit: number;
  page: number;
}

export interface PackListingResponse extends CustomApiResponse {
  data: PackListingResponseData;
}

export interface PackListingResponseData {
  packs: Pack[],
  count: number;
}
