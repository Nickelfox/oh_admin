import { Media } from '@hidden-innovation/media';
import { Test } from '@hidden-innovation/test/data-access';
import { Lesson, LessonCore } from './lesson.interface';
import { CustomApiResponse, PackContentTypeEnum, SortingEnum } from '@hidden-innovation/shared/models';
import { TestGroup } from '@hidden-innovation/test-group/data-access';
import { QuestionnaireExtended } from '@hidden-innovation/questionnaire/data-access';

export interface PackCore {
  name: string;
  description: string;
  thumbnailId: number;
  isPublished: boolean;
  // imageId: number;
  imagesAndPdfsIds: number[];
  urls: string[];
  posterId: number;
  content: ContentCore[] | LessonCore[];
}

export interface ContentCore {
  order: number | undefined;
  content_id: number | null;
  name: string;
  type: PackContentTypeEnum;
}

export interface PackContent extends ContentCore {
  id: number;
  created_at: string;
}

export interface PackContentListingRequest {
  limit: number;
  page: number;
}

export interface PackContentListingResponse extends CustomApiResponse {
  data: PackContentListingResponseData;
}

export interface PackContentListingResponseData {
  allPack: PackContent[];
  count: number;
}

export interface Pack extends PackCore {
  id: number;
  lessons: Lesson[];
  tests: Test[];
  testGroups: TestGroup[];
  // image: Media;
  thumbnail: Media;
  questionnaires: QuestionnaireExtended[];
  resources: Media[];
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

export interface PackMutationResponse extends CustomApiResponse {
  data: Pack;
}
