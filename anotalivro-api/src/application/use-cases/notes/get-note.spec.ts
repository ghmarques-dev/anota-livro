import { InMemoryNotesRepository } from 'src/infra/database/in-memory';
import { NotExistsError } from 'src/application/errors/errors';

import { GetNoteUseCase } from './get-note';

let notesRepository: InMemoryNotesRepository;
let sut: GetNoteUseCase;

describe('get note use case', () => {
  beforeEach(async () => {
    notesRepository = new InMemoryNotesRepository();
    sut = new GetNoteUseCase(notesRepository);

    await notesRepository.create({
      note_id: 'note_id',
      book_id: 'book_id',
      content: 'Content',
      title: 'Title',
      page: 30
    })
  });

  it('should be able to get a note successfully', async () => {
    const { note } = await sut.execute({
      book_id: 'book_id',
      note_id: 'note_id',
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
    const findByIdSpy = jest.spyOn(notesRepository, 'find_by_id');

    await sut.execute({
      book_id: 'book_id',
      note_id: 'note_id',
    });

    expect(findByIdSpy).toHaveBeenCalledWith({
      book_id: 'book_id',
      note_id: 'note_id',
    });
  });

  it('should be able to throw NotExistsError if note does not exist', async () => {
    await expect(() =>
      sut.execute({
        note_id: 'not-exist',
        book_id: 'book_id',
      }),
    ).rejects.toThrow(NotExistsError);
  });
});
