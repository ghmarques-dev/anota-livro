export interface Note {
  note_id: string;
  book_id: string;
  content: string;
  page?: number;
  created_at: Date;
}
