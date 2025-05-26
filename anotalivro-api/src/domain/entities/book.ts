import type { Note } from './note';

export type BookStatus = 'reading' | 'want_to_read' | 'finished';

export interface Book {
  book_id: string;
  user_id: string;
  title: string;
  author: string;
  total_pages: number;
  current_page: number;
  status: BookStatus;
  notes: Note[];
  updated_at: Date;
  created_at: Date;
}
