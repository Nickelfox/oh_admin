import { CustomApiResponse } from '@hidden-innovation/shared/models';

export  interface GoalsCore {
  question: string;
  description: string;
  header: string;
  body: string;
  reminder: number | undefined;
  id: number | undefined;
  goalAnswer: GoalAnswer[];
  showIcon: boolean;
}

export interface Goals extends GoalsCore {
  deleted_at: string;
  created_at: string;
  updatedAt: string;
}

export interface GoalAnswer {
  order: number | undefined;
  answerString: string;
  iconName: string;
  answerId: number | undefined;
  id: number | undefined;
}

export interface GoalResponse extends CustomApiResponse {
  data: Goals;
}

export interface UpdateGoalAnswers {

}

