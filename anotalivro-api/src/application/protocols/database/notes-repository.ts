import type { Note } from 'src/domain/entities';

export abstract class NotesRepository {
  abstract create(
    input: NotesRepository.Create.Input,
  ): NotesRepository.Create.Output;

  abstract find_by_id(
    input: NotesRepository.FindById.Input,
  ): NotesRepository.FindById.Output;

  abstract list_by_book(
    input: NotesRepository.ListByBook.Input,
  ): NotesRepository.ListByBook.Output;

  abstract update(
    input: NotesRepository.Update.Input,
  ): NotesRepository.Update.Output;

  abstract delete(
    input: NotesRepository.Delete.Input,
  ): NotesRepository.Delete.Output;
}

export namespace NotesRepository {
  export namespace Create {
    export type Input = {
      note_id?: string;
      book_id: string;
      page?: number;
      title: string;
      content: string;
    };

    export type Output = Promise<Note>;
  }

  export namespace FindById {
    export type Input = {
      note_id: string;
      book_id: string;
    };

    export type Output = Promise<Note | null>;
  }

  export namespace ListByBook {
    export type Input = {
      book_id: string;
      page?: number;
      limit?: number;
      order_by?: 'created_at' | 'updated_at';
      order_direction?: 'asc' | 'desc';
    };

    export type Output = Promise<Note[]>;
  }

  export namespace Update {
    export type Input = {
      note_id: string;
      data: Partial<{
        title: string;
        content: string;
        page?: number;
      }>;
    };

    export type Output = Promise<Note>;
  }

  export namespace Delete {
    export type Input = {
      note_id: string;
      book_id: string;
    };

    export type Output = Promise<void>;
  }
}
