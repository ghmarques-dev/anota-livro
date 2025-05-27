import type { NotesRepository } from 'src/application/protocols/database';
import type { Note } from 'src/domain/entities/note';

export class InMemoryNotesRepository implements NotesRepository {
  private database: Note[] = [];

  async create(
    input: NotesRepository.Create.Input,
  ): NotesRepository.Create.Output {
    const note: Note = {
      note_id: input.note_id ?? 'note_id',
      book_id: input.book_id,
      page: input.page,
      title: input.title,
      content: input.content,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.database.push(note);

    return note;
  }

  async find_by_id(
    input: NotesRepository.FindById.Input,
  ): NotesRepository.FindById.Output {
    const note = this.database.find(
      (item) =>
        item.note_id === input.note_id &&
        item.book_id === input.book_id,
    );

    if (!note) {
      return null;
    }

    return note;
  }

  async list_by_book(
    input: NotesRepository.ListByBook.Input
  ): NotesRepository.ListByBook.Output {
    const notes = this.database.filter(
      (item) => item.book_id === input.book_id,
    );

    return notes;
  }

  async update(
    input: NotesRepository.Update.Input,
  ): NotesRepository.Update.Output {
    const index = this.database.findIndex(
      (item) =>
        item.note_id === input.note_id
    );

    const note = this.database[index];

    const assignNote = Object.assign(note, input.data, {
      updated_at: new Date(),
    });

    this.database[index] = assignNote;

    return assignNote;
  }

  async delete(
    input: NotesRepository.Delete.Input,
  ): NotesRepository.Delete.Output {
    this.database = this.database.filter(
      (item) =>
        !(item.book_id === input.book_id && item.note_id === input.note_id),
    );
  }
}
