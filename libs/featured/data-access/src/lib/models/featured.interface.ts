  import { CustomApiResponse, FeaturedNameEnum, OrderedContent, TagCategoryEnum } from '@hidden-innovation/shared/models';
import {ContentCore, Pack} from '@hidden-innovation/pack/data-access';
import { Test } from '@hidden-innovation/test/data-access';
import { TestGroup } from '@hidden-innovation/test-group/data-access';
import { Media } from '@hidden-innovation/media';
import { QuestionnaireExtended } from '@hidden-innovation/questionnaire/data-access';

export interface FeaturedLocalState {
  id?: number | null;
  name: FeaturedNameEnum;
  location: 'HOME' | TagCategoryEnum;
  items: number;
  updated_at: string;
}


export interface FeaturedContent {
  id: number;
  created_at: string;
  name: string;
  type: string;
  inputType: string;
}

export interface FeaturedCore {
  name: FeaturedNameEnum | undefined;
  location: 'HOME' | TagCategoryEnum | undefined;
  heading: string | undefined;
  subHeading: string | undefined;
  bottomText: string | undefined;
  posterId: number | undefined;
  content: ContentCore[]
  singleTestIds: OrderedContent[];
  testGroupIds: OrderedContent[];
  packIds: OrderedContent[];
  questionnaireIds: OrderedContent[];
  // content: string;
}


export interface Featured extends FeaturedCore {
  id: number;
  tests: Test[];
  testGroups: TestGroup[];
  packs: Pack[];
  // image: Media;
  // thumbnail: Media;
  questionnaires: QuestionnaireExtended[];
  poster: Media;
  // content: Content[] | Lesson[];
  deleted_at: string;
  created_at: string;
  updatedAt: string;
}

export interface FeaturedResponse extends CustomApiResponse {
  data: FeaturedResponseData;
}

export interface FeaturedResponseData extends Featured {
  featured: Featured[];
}

export interface FeaturedListingResponse extends CustomApiResponse {
  data: Featured[];
}

export interface FeaturedUpdateResponse extends CustomApiResponse {
  data: Featured;
}

