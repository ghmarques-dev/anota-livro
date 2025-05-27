import { Injectable } from '@nestjs/common';

import { NotExistsError } from 'src/application/errors/errors';
import type { BooksRepository } from 'src/application/protocols/database';

import type { Book } from 'src/domain/entities';

export type IGetBookUseCaseInput = {
  book_id: string;
  user_id: string;
};

export type IGetBookUseCaseOutput = Promise<{
  book: Book
}>;

@Injectable()
export class GetBookUseCase {
  constructor(
    private booksRepository: BooksRepository
  ) {}

  async execute(input: IGetBookUseCaseInput): Promise<IGetBookUseCaseOutput> {
    const book = await this.booksRepository.find_by_id({
      book_id: input.book_id,
      user_id: input.user_id
    })

    if (!book) {
      throw new NotExistsError('Book');
    }
   
    return {
      book
    }
  }
}
