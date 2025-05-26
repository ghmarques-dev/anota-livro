export interface Note {
  note_id: string;
  book_id: string;
  content: string;
  page?: number;
  updated_at: Date;
  created_at: Date;
}
