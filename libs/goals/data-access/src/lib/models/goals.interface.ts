import { CustomApiResponse } from '@hidden-innovation/shared/models';

export  interface GoalsCore {
  question: string;
  description: string;
  header: string;
  body: string;
  reminder: number;

}

export interface Goals extends GoalsCore {
  deleted_at: string;
  created_at: string;
  updatedAt: string;
  goalAnswer: GoalAnswer[];
}

export interface GoalAnswer {
  order?: number;
  answerString: string;
  iconName?: string;
  point?: number;
}

export interface GoalResponse extends CustomApiResponse {
  data: Goals;
}

