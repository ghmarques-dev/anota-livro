import type { Book } from './book';

export interface User {
  user_id: string;
  email: string;
  password: string;
  refresh_token?: string;
  books: Book[];
  created_at: Date;
  updated_at: Date;
}
