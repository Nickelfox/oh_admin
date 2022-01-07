import { Media } from '@hidden-innovation/media';
import { Test, TestListingFilters } from '@hidden-innovation/test/data-access';
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
  subTitle: string;
  urls: ContentUrl[];
  posterId: number;
  content: ContentCore[] | LessonCore[];
}

export interface ContentCore {
  order: number | undefined;
  contentId: number | null;
  name: string;
  type: PackContentTypeEnum;
}

export interface Content extends ContentCore {
  id: number;
  contentOrder: number;
  packId: number;
  name: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PackContent {
  id: number;
  created_at: string;
  name: string;
  type: PackContentTypeEnum;
  inputType: string;
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
  imagesAndPdfs: Media[];
  poster: Media;
  urls: ContentUrl[];
  content: Content[] | Lesson[];
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

export interface PackDetailsResponse extends CustomApiResponse {
  data: Pack;
}

export interface PackMutationResponse extends CustomApiResponse {
  data: Pack;
}

export interface ContentUrl {
  url: string;
  description: string;
}

export interface PackPublishToggleRequest {
  newState: boolean;
  id: number;
}

export interface PackDeleteRequest extends PackListingFilters {
  id: number;
  pageIndex: number;
  pageSize: number;
}
