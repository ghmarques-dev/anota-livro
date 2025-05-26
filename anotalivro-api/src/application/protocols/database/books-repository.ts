import type { Book, BookStatus } from 'src/domain/entities';

export abstract class BooksRepository {
  abstract create(
    input: BooksRepository.Create.Input,
  ): BooksRepository.Create.Output;

  abstract update(
    input: BooksRepository.Update.Input,
  ): BooksRepository.Update.Output;

  abstract delete(
    input: BooksRepository.Delete.Input,
  ): BooksRepository.Delete.Output;

  abstract find_by_id(
    input: BooksRepository.FindById.Input,
  ): BooksRepository.FindById.Output;

  abstract find_by_title(
    input: BooksRepository.FindByTitle.Input,
  ): BooksRepository.FindByTitle.Output;

  abstract find_all_by_user(
    input: BooksRepository.FindAllByUser.Input,
  ): BooksRepository.FindAllByUser.Output;
}

export namespace BooksRepository {
  export namespace Create {
    export type Input = {
      book_id?: string;
      user_id: string;
      title: string;
      author: string;
      total_pages: number;
      current_page?: number;
      status: BookStatus;
    };

    export type Output = Promise<Book>;
  }

  export namespace Update {
    export type Input = {
      book_id: string;
      data: Partial<{
        title: string;
        author: string;
        total_pages: number;
        current_page: number;
        status: BookStatus;
      }>;
    };

    export type Output = Promise<Book | null>;
  }

  export namespace Delete {
    export type Input = {
      book_id: string;
      user_id: string;
    };

    export type Output = Promise<void>;
  }

  export namespace FindById {
    export type Input = {
      book_id: string;
      user_id: string;
    };

    export type Output = Promise<Book | null>;
  }

  export namespace FindByTitle {
    export type Input = {
      user_id: string;
      title: string;
    }

    export type Output = Promise<Book | null>;
  }

  export namespace FindAllByUser {
    export type Input = {
      user_id: string;
    };

    export type Output = Promise<Book[]>;
  }
}
