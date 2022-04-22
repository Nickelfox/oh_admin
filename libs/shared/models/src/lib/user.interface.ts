import { UserStatusEnum } from './user.enum';

export interface UserDetails {
  id: number;
  email: string;
  password?: string;
  username: string;
  name: string;
  role: string;
  language: string;
  created_at: string;
  updated_at: string;
  age: number;
  gender: string;
  height: number;
  skinColor: string;
  status: boolean;
  video: boolean;
  weight: number;
  is_blocked: boolean;
  blocked_at: string;
  goalAnswerId:number;
  goalAnswer: GoalAnswer;
  CPS: number | null;
  OOS: number | null;
}

export  interface  GoalAnswer
{
  id:number;
  answerString:string;
  deleted_at:string;
  created_at:string;
  updated_at:string;
  goalQuestionId:number;
  icon:string;
  iconName:string;
  order:number;
  points:number;
  usedcount:number;
}
