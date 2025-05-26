import { Injectable } from '@nestjs/common';

import { NotExistsError } from 'src/application/errors/errors';
import type { BooksRepository } from 'src/application/protocols/database';

import type { Book,  } from 'src/domain/entities';

export type IDeleteBookUseCaseInput = {
  book_id: string;
  user_id: string;
};

export type IDeleteBookUseCaseOutput = Promise<void>;

@Injectable()
export class DeleteBookUseCase {
  constructor(
    private booksRepository: BooksRepository
  ) {}

  async execute(input: IDeleteBookUseCaseInput): Promise<IDeleteBookUseCaseOutput> {
    const bookAlreadyExists = await this.booksRepository.find_by_id({
      book_id: input.book_id,
      user_id: input.user_id
    })

    if (!bookAlreadyExists) {
      throw new NotExistsError('Book');
    }
    
    await this.booksRepository.delete({ 
      book_id: input.book_id,
      user_id: input.user_id
    });
  }
}
