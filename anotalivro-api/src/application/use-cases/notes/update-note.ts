import { Injectable } from '@nestjs/common';

import { NotExistsError } from 'src/application/errors/errors';
import type { NotesRepository } from 'src/application/protocols/database';

import type { Note } from 'src/domain/entities';

export type IUpdateNoteUseCaseInput = {
  book_id: string;
  note_id: string;
  data: {
    content: string;
    title: string;
    page?: number;
  };
};

export type IUpdateNoteUseCaseOutput = Promise<{
  note: Note;
}>;

@Injectable()
export class UpdateNoteUseCase {
  constructor(
    private notesRepository: NotesRepository,
  ) {}

  async execute(input: IUpdateNoteUseCaseInput): IUpdateNoteUseCaseOutput {
    const noteAlreadyExists = await this.notesRepository.find_by_id({
      book_id: input.book_id,
      note_id: input.note_id
    })

    if (!noteAlreadyExists) {
      throw new NotExistsError("Note")
    }

    const { data } = input

    const note = await this.notesRepository.update({
      note_id: input.note_id,
      data: {
        content: data.content,
        title: data.title,
        page: data.page
      }
    })

    return {
      note
    }
  }
}
