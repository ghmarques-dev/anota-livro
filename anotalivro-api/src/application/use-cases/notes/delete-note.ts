import { Injectable } from '@nestjs/common';

import { NotExistsError } from 'src/application/errors/errors';
import type { NotesRepository } from 'src/application/protocols/database';

export type IDeleteNoteUseCaseInput = {
  note_id: string;
  book_id: string;
};

export type IDeleteNoteUseCaseOutput = Promise<void>;

@Injectable()
export class DeleteNoteUseCase {
  constructor(
    private notesRepository: NotesRepository
  ) {}

  async execute(input: IDeleteNoteUseCaseInput): Promise<IDeleteNoteUseCaseOutput> {
    const noteAlreadyExists = await this.notesRepository.find_by_id({
      note_id: input.note_id,
      book_id: input.book_id
    })

    if (!noteAlreadyExists) {
      throw new NotExistsError('Note');
    }
    
    await this.notesRepository.delete({ 
      note_id: input.note_id,
      book_id: input.book_id
    });
  }
}
