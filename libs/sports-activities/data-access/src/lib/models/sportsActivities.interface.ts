import { CustomApiResponse } from '@hidden-innovation/shared/models';

export  interface SportActivitiesCore {
  question: string;
  description: string;
  header: string;
  body: string;
  reminder: number | undefined;
  id: number | undefined;
  sportsActivitiesAnswer: SportActivitiesAnswer[];
  showIcon: boolean;
}

export interface SportActivities extends SportActivitiesCore {
  deleted_at: string;
  created_at: string;
  updatedAt: string;
}

export interface SportActivitiesAnswer {
  order: number | undefined;
  answerString: string;
  iconName: string;
  answerId: number | undefined;
  id: number | undefined;
}

export interface SportActivitiesResponse extends CustomApiResponse {
  data: SportActivities;
}

export interface UpdateGoalAnswers {

}

