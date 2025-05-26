import { Injectable } from '@nestjs/common';
import { AlreadyExistError } from 'src/application/errors/errors';
import type { BooksRepository } from 'src/application/protocols/database/books-repository';
import type { Book, BookStatus } from 'src/domain/entities';

export type ICreateBookUseCaseInput = {
  user_id: string;
  data: {
    title: string;
    author: string;
    total_pages: number;
    current_page: number;
    status: BookStatus;
  };
};

export type ICreateBookUseCaseOutput = Promise<{
  book: Book;
}>;

@Injectable()
export class CreateBookUseCase {
  constructor(
    private booksRepository: BooksRepository
  ) {}

  async execute(input: ICreateBookUseCaseInput): ICreateBookUseCaseOutput {
    const { data } = input

    const bookWithSameTitle = await this.booksRepository.find_by_title({
      title: data.title,
      user_id: input.user_id
    })

    if (bookWithSameTitle) {
      throw new AlreadyExistError("Book with the same title")
    }

    const book = await this.booksRepository.create({
      user_id: input.user_id,
      author: data.author,
      status: data.status,
      title: data.title,
      total_pages: data.total_pages,
      current_page: data.current_page
    })

    return {
      book
    }
  }
}
