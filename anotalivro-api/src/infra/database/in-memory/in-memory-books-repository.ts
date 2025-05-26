import type { BooksRepository } from 'src/application/protocols/database';
import type { Book } from 'src/domain/entities';

export class InMemoryBooksRepository implements BooksRepository {
  private database: Book[] = [];

  async create(
    input: BooksRepository.Create.Input,
  ): BooksRepository.Create.Output {
    const book: Book = {
      book_id: input.book_id ?? "book_id",
      user_id: input.user_id,
      title: input.title,
      author: input.author,
      total_pages: input.total_pages,
      current_page: input.current_page ?? 0,
      status: input.status,
      notes: [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.database.push(book);

    return book;
  }

  async update(
    input: BooksRepository.Update.Input,
  ): BooksRepository.Update.Output {
    const index = this.database.findIndex(
      (item) => item.book_id == input.book_id,
    );

    const book = this.database[index];

    if (!book) {
      return null
    }
    
    const assignUser = Object.assign(book, input.data);

    this.database[index] = assignUser;

    return assignUser;
  }

  async delete(
    input: BooksRepository.Delete.Input,
  ): BooksRepository.Delete.Output {
    this.database = this.database.filter(
      (item) =>
        !(item.book_id === input.book_id && item.user_id === input.user_id),
    );
  }

  async find_by_id(
    input: BooksRepository.FindById.Input,
  ): BooksRepository.FindById.Output {
    const book = this.database.find(
      (item) => item.book_id === input.book_id && item.user_id === input.user_id,
    );

    if (!book) {
      return null
    }

    return book;
  }

  async find_by_title(
    input: BooksRepository.FindByTitle.Input,
  ): BooksRepository.FindByTitle.Output {
    const book = this.database.find(
      (item) => item.user_id === input.user_id && item.title === input.title,
    );

    if (!book) {
      return null
    }

    return book;
  }

  async find_all_by_user(
    input: BooksRepository.FindAllByUser.Input,
  ): BooksRepository.FindAllByUser.Output {
    const books = this.database.filter((b) => b.user_id === input.user_id);

    return books
  }
}
