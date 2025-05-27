import { Injectable } from '@nestjs/common';

import type { NotesRepository } from 'src/application/protocols/database';

import type { Book, Note } from 'src/domain/entities';

export type IFetchNotesUseCaseInput = {
  book_id: string;
};

export type IFetchNotesUseCaseOutput = Promise<{
  notes: Note[]
}>;

@Injectable()
export class FetchNotesUseCase {
  constructor(
    private notesRepository: NotesRepository
  ) {}

  async execute(input: IFetchNotesUseCaseInput): Promise<IFetchNotesUseCaseOutput> {
    const notes = await this.notesRepository.list_by_book({
      book_id: input.book_id
    })

    return {
      notes
    }
  }
}
