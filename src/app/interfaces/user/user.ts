import { UserExtra } from './user-extra';

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: any;
  role: any;
  user_extra: any;
  created_at: Date;
  updated_at: Date;
  push_notification: boolean;
  email_notification: boolean;
  result: number;
  institutions?: any
}