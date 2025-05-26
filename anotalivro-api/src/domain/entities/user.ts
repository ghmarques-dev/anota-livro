import type { Book } from './book';

export interface User {
  user_id: string;
  email: string;
  password: string;
  refresh_token?: string;
  books: Book[];
  updated_at: Date;
  created_at: Date;
}
