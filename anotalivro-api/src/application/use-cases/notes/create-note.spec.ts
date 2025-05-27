import type { BooksRepository } from 'src/application/protocols/database/books-repository';
import type { NotesRepository } from 'src/application/protocols/database';

import { InMemoryBooksRepository } from 'src/infra/database/in-memory';
import { InMemoryNotesRepository } from 'src/infra/database/in-memory/in-memory-notes-repository';

import  { CreateNoteUseCase } from './create-note';
import { NotExistsError } from 'src/application/errors/errors';

let booksRepository: BooksRepository;
let notesRepository: NotesRepository;
let sut: CreateNoteUseCase;

describe('create note use case', () => {
  beforeEach(async () => {
    booksRepository = new InMemoryBooksRepository();
    notesRepository = new InMemoryNotesRepository();

    sut = new CreateNoteUseCase(notesRepository, booksRepository);

    await booksRepository.create({
      book_id: 'book_id',
      user_id: 'user_id',
      title: 'Original Title',
      author: 'Author',
      status: 'reading',
      current_page: 20,
      total_pages: 200,
    });
  });

  it('should be able to create note with successful', async () => {
    const { note } = await sut.execute({
      user_id: 'user_id',
      book_id: 'book_id',
      data: {
        title: 'Title',
        content: 'Content', 
        page: 30
      }
    });

    expect(note.note_id).toBe('note_id');
    expect(note.book_id).toBe('book_id');
    expect(note.title).toBe('Title');
    expect(note.content).toBe('Content');
    expect(note.page).toBe(30);
    expect(note.created_at).toBeDefined();
    expect(note.updated_at).toBeDefined();
  });

   it('should be able to call find_by_id with correct values', async () => {
      const booksRepositorySpy = jest.spyOn(booksRepository, 'find_by_id');
  
      await sut.execute({
        user_id: 'user_id',
        book_id: 'book_id',
        data: {
          title: 'Title',
          content: 'Content', 
          page: 30
        }
      });
  
      expect(booksRepositorySpy).toHaveBeenCalledWith({
        user_id: 'user_id',
        book_id: 'book_id',
      });
    })
  
    it('should be able to throw NotExistsError if book does not exist', async () => {
      await expect(() =>
        sut.execute({
          user_id: 'user_id',
          book_id: 'not_exists',
          data: {
            title: 'Title',
            content: 'Content', 
            page: 30
          }
        })
      ).rejects.toThrow(NotExistsError);
    });

    it('should be able to call create with correct values', async () => {
      const notesRepositorySpy = jest.spyOn(notesRepository, 'create')

      await sut.execute({
        user_id: 'user_id',
        book_id: 'book_id',
        data: {
          title: 'Title',
          content: 'Content', 
          page: 30
        }
      });

      expect(notesRepositorySpy).toHaveBeenCalledWith({
        book_id: 'book_id',
        content: 'Content',
        title: 'Title',
        page: 30
      })
    })
});
