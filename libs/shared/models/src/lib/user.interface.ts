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
}
