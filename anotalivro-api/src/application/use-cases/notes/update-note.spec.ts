import type { NotesRepository } from 'src/application/protocols/database';

import { InMemoryNotesRepository } from 'src/infra/database/in-memory/in-memory-notes-repository';

import { UpdateNoteUseCase } from './update-note';
import { NotExistsError } from 'src/application/errors/errors';

let notesRepository: NotesRepository;
let sut: UpdateNoteUseCase;

describe('update note use case', () => {
  beforeEach(async () => {
    notesRepository = new InMemoryNotesRepository();

    sut = new UpdateNoteUseCase(notesRepository);

    await notesRepository.create({
      note_id: 'note_id',
      book_id: 'book_id',
      content: 'Content',
      title: 'Title',
      page: 30
    })
  });

  it('should be able to update note with successful', async () => {
    const { note } = await sut.execute({
      note_id: 'note_id',
      book_id: 'book_id',
      data: {
        title: 'Title_Updated',
        content: 'Content_Updated', 
        page: 30
      }
    });

    expect(note.note_id).toBe('note_id');
    expect(note.book_id).toBe('book_id');
    expect(note.title).toBe('Title_Updated');
    expect(note.content).toBe('Content_Updated');
    expect(note.page).toBe(30);
    expect(note.created_at).toBeDefined();
    expect(note.updated_at).toBeDefined();
  });

  it('should be able to call find_by_id with correct values', async () => {
    const notesRepositorySpy = jest.spyOn(notesRepository, 'find_by_id')

    await sut.execute({
      note_id: 'note_id',
      book_id: 'book_id',
      data: {
        title: 'Title_Updated',
        content: 'Content_Updated', 
        page: 30
      }
    });

    expect(notesRepositorySpy).toHaveBeenCalledWith({
      book_id: 'book_id',
      note_id: 'note_id'
    })
  })

  it('should be able to throw NotExistsError if note does not exist', async () => {
      await expect(() =>
        sut.execute({
          note_id: 'not-exist',
          book_id: 'book_id',
          data: {
            title: 'Title',
            content: 'Content', 
            page: 30
          }
        })
    ).rejects.toThrow(NotExistsError);
  });
  
   it('should be able to call create with correct values', async () => {
      const notesRepositorySpy = jest.spyOn(notesRepository, 'update')

      await sut.execute({
        note_id: 'note_id',
        book_id: 'book_id',
        data: {
          title: 'Title',
          content: 'Content', 
          page: 30
        }
      });

      expect(notesRepositorySpy).toHaveBeenCalledWith({
        note_id: 'note_id',
        data: {
          content: 'Content',
          title: 'Title',
          page: 30
        }
      })
    })
});
