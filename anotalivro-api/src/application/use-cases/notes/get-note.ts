import { Injectable } from '@nestjs/common';

import { NotExistsError } from 'src/application/errors/errors';
import type { NotesRepository } from 'src/application/protocols/database';

import type { Note } from 'src/domain/entities';

export type IGetNoteUseCaseInput = {
  note_id: string;
  book_id: string;
};

export type IGetNoteUseCaseOutput = Promise<{
  note: Note
}>;

@Injectable()
export class GetNoteUseCase {
  constructor(
    private notesRepository: NotesRepository
  ) {}

  async execute(input: IGetNoteUseCaseInput): Promise<IGetNoteUseCaseOutput> {
    const note = await this.notesRepository.find_by_id({
      note_id: input.note_id,
      book_id: input.book_id
    })

    if (!note) {
      throw new NotExistsError('Note');
    }
   
    return {
      note
    }
  }
}
