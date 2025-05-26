import { InMemoryBooksRepository } from 'src/infra/database/in-memory';

import  { FetchBooksUseCase } from './fetch-books';

let booksRepository: InMemoryBooksRepository;
let sut: FetchBooksUseCase;

describe('fetch book use case', () => {
  beforeEach(async () => {
    booksRepository = new InMemoryBooksRepository();
    sut = new FetchBooksUseCase(booksRepository);

    for(let i = 0; i < 10; i++) {
      await booksRepository.create({
        book_id: 'book_id',
        user_id: 'user_id',
        title: 'Title',
        author: 'Author',
        status: 'reading',
        current_page: 20,
        total_pages: 200,
      });
    }
  });

  it('should be able to get a book successfully', async () => {
    const { books } = await sut.execute({
      user_id: 'user_id',
    });

    expect(books).toHaveLength(10);
  });
});
