import { InMemoryNotesRepository } from 'src/infra/database/in-memory';

import  { FetchNotesUseCase } from './fetch-notes';

let notesRepository: InMemoryNotesRepository;
let sut: FetchNotesUseCase;

describe('fetch book use case', () => {
  beforeEach(async () => {
    notesRepository = new InMemoryNotesRepository();
    sut = new FetchNotesUseCase(notesRepository);

    for(let i = 0; i < 10; i++) {
      await notesRepository.create({
        note_id: 'note_id',
        book_id: 'book_id',
        content: 'Content',
        title: 'Title',
        page: 30
      })
    }
  });

  it('should be able to get a book successfully', async () => {
    const { notes } = await sut.execute({
      book_id: 'book_id',
    });

    expect(notes).toHaveLength(10);
  });
});
