import { Injectable } from '@nestjs/common';

import { NotExistsError } from 'src/application/errors/errors';
import type { BooksRepository } from 'src/application/protocols/database';

import type { Book, BookStatus } from 'src/domain/entities';

export type IUpdateBookUseCaseInput = {
  user_id: string;
  book_id: string;
  data: Partial<{
    title: string;
    author: string;
    total_pages: number;
    current_page: number;
    status: BookStatus;
  }>;
};

export type IUpdateBookUseCaseOutput = Promise<{
  book: Book;
}>;

@Injectable()
export class UpdateBookUseCase {
  constructor(
    private booksRepository: BooksRepository
  ) {}

  async execute(input: IUpdateBookUseCaseInput): Promise<IUpdateBookUseCaseOutput> {
    const { data } = input

    const bookExists = await this.booksRepository.find_by_id({ 
      book_id: input.book_id,
      user_id: input.user_id
    });

    if (!bookExists) {
      throw new NotExistsError('Book');
    }

    const book = await this.booksRepository.update({ 
      book_id: input.book_id,
      data
    });

    return {
      book
    };
  }
}
