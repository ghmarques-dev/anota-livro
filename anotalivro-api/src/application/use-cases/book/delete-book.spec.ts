import { InMemoryBooksRepository } from 'src/infra/database/in-memory';
import { NotExistsError } from 'src/application/errors/errors';

import { DeleteBookUseCase } from './delete-book';

let booksRepository: InMemoryBooksRepository;
let sut: DeleteBookUseCase;

describe('delete book use case', () => {
  beforeEach(async () => {
    booksRepository = new InMemoryBooksRepository();
    sut = new DeleteBookUseCase(booksRepository);

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

  it('should be able to delete a book successfully', async () => {
    await sut.execute({
      user_id: 'user_id',
      book_id: 'book_id',
    });

    const result = await booksRepository.find_by_id({
      user_id: 'user_id',
      book_id: 'book_id',
    });

    expect(result).toBeNull();
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

  it('should be able to call delete with correct values', async () => {
    const deleteSpy = jest.spyOn(booksRepository, 'delete');

    await sut.execute({
      user_id: 'user_id',
      book_id: 'book_id',
    });

    expect(deleteSpy).toHaveBeenCalledWith({
      user_id: 'user_id',
      book_id: 'book_id',
    });
  });
});
