import { Injectable } from '@nestjs/common';
import { NotExistsError } from 'src/application/errors/errors';
import type { BooksRepository, NotesRepository } from 'src/application/protocols/database';
import type { Note } from 'src/domain/entities';

export type ICreateNoteUseCaseInput = {
  book_id: string;
  user_id: string;
  data: {
    content: string;
    title: string;
    page?: number;
  };
};

export type ICreateNoteUseCaseOutput = Promise<{
  note: Note;
}>;

@Injectable()
export class CreateNoteUseCase {
  constructor(
    private notesRepository: NotesRepository,
    private booksRepository: BooksRepository
  ) {}

  async execute(input: ICreateNoteUseCaseInput): ICreateNoteUseCaseOutput {
    const bookExists = await this.booksRepository.find_by_id({
      book_id: input.book_id,
      user_id: input.user_id
    })

    if (!bookExists) {
      throw new NotExistsError("Book")
    }

    const { data } = input

    const note = await this.notesRepository.create({
      book_id: input.book_id,
      content: data.content,
      title: data.title,
      page: data.page
    })

    return {
      note
    }
  }
}
