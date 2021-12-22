import { Media } from '@hidden-innovation/media';
import { Test } from '@hidden-innovation/test/data-access';
import { Lesson, LessonCore } from './lesson.interface';
import { CustomApiResponse, SortingEnum } from '@hidden-innovation/shared/models';
import { TestGroup } from '@hidden-innovation/test-group/data-access';
import { QuestionnaireExtended } from '@hidden-innovation/questionnaire/data-access';

export interface PackCore {
  name: string;
  description: string;
  thumbnailId: number;
  isPublished: boolean;
  imageId: number;
  urls: string[];
  posterId: number;
  lessons: LessonCore[];
  testGroupIds: number[];
  questionnaireIds: number[];
  testIds: number[];
}

export interface Pack extends PackCore {
  id: number;
  lessons: Lesson[];
  tests: Test[];
  testGroups: TestGroup[];
  image: Media;
  thumbnail: Media;
  questionnaires: QuestionnaireExtended[];
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
