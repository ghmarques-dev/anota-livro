import { Injectable } from '@nestjs/common';

import type { BooksRepository } from 'src/application/protocols/database';

import type { Book } from 'src/domain/entities';

export type IFetchBooksUseCaseInput = {
  user_id: string;
};

export type IFetchBooksUseCaseOutput = Promise<{
  books: Book[]
}>;

@Injectable()
export class FetchBooksUseCase {
  constructor(
    private booksRepository: BooksRepository
  ) {}

  async execute(input: IFetchBooksUseCaseInput): Promise<IFetchBooksUseCaseOutput> {
    const books = await this.booksRepository.find_all_by_user({
      user_id: input.user_id
    })

    return {
      books
    }
  }
}
