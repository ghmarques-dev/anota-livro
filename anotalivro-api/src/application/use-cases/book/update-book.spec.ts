import { InMemoryBooksRepository } from 'src/infra/database/in-memory';

import { NotExistsError } from 'src/application/errors/errors';

import { UpdateBookUseCase } from './update-book';

let booksRepository: InMemoryBooksRepository;
let sut: UpdateBookUseCase;

describe('update book use case', () => {
  beforeEach(async () => {
    booksRepository = new InMemoryBooksRepository();
    sut = new UpdateBookUseCase(booksRepository);

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

  it('should be able to update a book successfully', async () => {
    const { book } = await sut.execute({
      user_id: 'user_id',
      book_id: 'book_id',
      data: {
        title: 'New Title',
        current_page: 50,
      },
    });

    expect(book.book_id).toBe('book_id');
    expect(book.user_id).toBe('user_id');
    expect(book.title).toBe('New Title');
    expect(book.author).toBe('Author');
    expect(book.status).toBe('reading');
    expect(book.current_page).toBe(50);
    expect(book.total_pages).toBe(200);
    expect(book.updated_at).toBeDefined();
    expect(book.created_at).toBeDefined();
  });

  it('should be able to call find_by_id with correct values', async () => {
    const booksRepositorySpy = jest.spyOn(booksRepository, 'find_by_id');

    await sut.execute({
      user_id: 'user_id',
      book_id: 'book_id',
      data: {
        title: 'Updated Title',
      },
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
        book_id: 'nonexistent',
        data: { title: 'New Title' },
      }),
    ).rejects.toThrow(NotExistsError);
  });

  it('should be able to call update with correct values', async () => {
    const booksRepositorySpy = jest.spyOn(booksRepository, 'update');

    await sut.execute({
      user_id: 'user_id',
      book_id: 'book_id',
      data: {
        title: 'Updated Title',
      },
    });

    expect(booksRepositorySpy).toHaveBeenCalledWith({
      book_id: 'book_id',
      data: expect.objectContaining({ title: 'Updated Title' }),
    });
  });
});
