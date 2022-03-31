export  interface GoalsCore {
  question: string;
  description: string;
  header: string;
  body: string;
  reminder: number;
  goalAnswer: GoalAnswer[];
}
export interface GoalAnswer {
  order?: number;
  answerString: string;
  iconName?: string;
  point?: number;
  goalQuestionId:number
}
