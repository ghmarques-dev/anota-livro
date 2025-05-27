import { InMemoryNotesRepository } from 'src/infra/database/in-memory';
import { NotExistsError } from 'src/application/errors/errors';

import { DeleteNoteUseCase } from './delete-note';

let notesRepository: InMemoryNotesRepository;
let sut: DeleteNoteUseCase;

describe('delete note use case', () => {
  beforeEach(async () => {
    notesRepository = new InMemoryNotesRepository();
    sut = new DeleteNoteUseCase(notesRepository);

    await notesRepository.create({
      note_id: 'note_id',
      book_id: 'book_id',
      content: 'Content',
      title: 'Title',
      page: 30
    })
  });

  it('should be able to delete a note successfully', async () => {
    await sut.execute({
      book_id: 'book_id',
      note_id: 'note_id',
    });

    const result = await notesRepository.find_by_id({
      book_id: 'book_id',
      note_id: 'note_id',
    });

    expect(result).toBeNull();
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
        book_id: 'book_id',
        note_id: 'nonexistent',
      }),
    ).rejects.toThrow(NotExistsError);
  });

  it('should be able to call delete with correct values', async () => {
    const deleteSpy = jest.spyOn(notesRepository, 'delete');

    await sut.execute({
      book_id: 'book_id',
      note_id: 'note_id',
    });

    expect(deleteSpy).toHaveBeenCalledWith({
      book_id: 'book_id',
      note_id: 'note_id',
    });
  });
});
