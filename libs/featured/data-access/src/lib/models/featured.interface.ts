import {
  CustomApiResponse,
  FeaturedNameEnum,
  PackContentTypeEnum,
  SortingEnum,
  TagCategoryEnum
} from "@hidden-innovation/shared/models";
import {
  Pack,
} from "@hidden-innovation/pack/data-access";
import {Test} from "@hidden-innovation/test/data-access";
import {TestGroup} from "@hidden-innovation/test-group/data-access";
import {Media} from "@hidden-innovation/media";
import {QuestionnaireExtended} from "@hidden-innovation/questionnaire/data-access";

export interface FeaturedLocalState {
  name: FeaturedNameEnum;
  location: 'HOME' | TagCategoryEnum;
  items: number;
  deleted_at: string;
  created_at: string;
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
  name: FeaturedNameEnum;
  location:  'HOME' | TagCategoryEnum;
  heading:string | undefined;
  subHeading:string | undefined;
  bottomText:string | undefined;
  posterId: number | undefined;
  singleTestIds: number[];
  testGroupIds: number[];
  packIds: number[];
  questionnaireIds: number[];
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
  updated_at: string;
}

export interface FeaturedListingFilters {
  dateSort: SortingEnum | undefined;
  nameSort: SortingEnum | undefined;
  // published: 'TRUE' | 'FALSE' | undefined;
  search: string | undefined;
}

export interface FeaturedListingRequest extends FeaturedListingFilters {
  limit: number;
  page: number;
}

export interface FeaturedListingResponse extends CustomApiResponse {
  data: FeaturedListingResponseData;
}

export interface FeaturedListingResponseData {
  featureds: Featured[],
  count: number;
}

