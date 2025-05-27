import { InMemoryBooksRepository } from 'src/infra/database/in-memory';
import { NotExistsError } from 'src/application/errors/errors';

import { GetBookUseCase } from './get-book';

let booksRepository: InMemoryBooksRepository;
let sut: GetBookUseCase;

describe('get book use case', () => {
  beforeEach(async () => {
    booksRepository = new InMemoryBooksRepository();
    sut = new GetBookUseCase(booksRepository);

    await booksRepository.create({
      book_id: 'book_id',
      user_id: 'user_id',
      title: 'Title',
      author: 'Author',
      status: 'reading',
      current_page: 20,
      total_pages: 200,
    });
  });

  it('should be able to get a book successfully', async () => {
    const { book } = await sut.execute({
      user_id: 'user_id',
      book_id: 'book_id',
    });

    expect(book.book_id).toBe('book_id');
    expect(book.user_id).toBe('user_id');
    expect(book.title).toBe('Title');
    expect(book.author).toBe('Author');
    expect(book.status).toBe('reading');
    expect(book.current_page).toBe(20);
    expect(book.total_pages).toBe(200);
    expect(book.notes).toHaveLength(0);
    expect(book.created_at).toBeDefined();
    expect(book.updated_at).toBeDefined();
  });

  it('should be able to call find_by_id with correct values', async () => {
    const findByIdSpy = jest.spyOn(booksRepository, 'find_by_id');

    await sut.execute({
      user_id: 'user_id',
      book_id: 'book_id',
    });

    expect(findByIdSpy).toHaveBeenCalledWith({
      user_id: 'user_id',
      book_id: 'book_id',
    });
  });

  it('should be able to throw NotExistsError if book does not exist', async () => {
    await expect(() =>
      sut.execute({
        user_id: 'user_id',
        book_id: 'nonexistent',
      }),
    ).rejects.toThrow(NotExistsError);
  });
});
