import { InMemoryBooksRepository } from 'src/infra/database/in-memory';

import { BooksRepository } from 'src/application/protocols/database/books-repository';
import { CreateBookUseCase } from './create-book';
import { AlreadyExistError } from 'src/application/errors/errors';
import type { Book } from 'src/domain/entities';

let booksRepository: BooksRepository;
let sut: CreateBookUseCase;

describe('create book use case', () => {
  beforeEach(() => {
    booksRepository = new InMemoryBooksRepository();

    sut = new CreateBookUseCase(booksRepository);
  });

  it('should be able to create book with successful', async () => {
    const { book } = await sut.execute({
      user_id: 'user_id',
      data: {
        title: 'Title',
        author: 'Author',
        status: 'reading',
        current_page: 50,
        total_pages: 208
      }
    });

    expect(book.book_id).toBe('book_id');
    expect(book.user_id).toBe('user_id');
    expect(book.title).toBe('Title');
    expect(book.author).toBe('Author');
    expect(book.status).toBe('reading');
    expect(book.current_page).toBe(50);
    expect(book.total_pages).toBe(208);
    expect(book.notes).toHaveLength(0);
    expect(book.created_at).toBeDefined();
    expect(book.updated_at).toBeDefined();
  });

  it('should be able to call find_by_title with correct values', async () => {
    const booksRepositorySpy = jest.spyOn(booksRepository, 'find_by_title')

    await sut.execute({
      user_id: 'user_id',
      data: {
        title: 'Title',
        author: 'Author',
        status: 'reading',
        current_page: 50,
        total_pages: 208
      }
    })
    
    expect(booksRepositorySpy).toHaveBeenCalledWith({
      user_id: "user_id",
      title: "Title",
    })
  })

  it('should be able to call find_by_title with book exists', async () => {
    const book: Book = {
      book_id: 'book_id',
      user_id: 'user_id',
      title: 'Title',
      notes: [],
      author: 'Author',
      status: 'reading',
      current_page: 50,
      total_pages: 208,
      updated_at: new Date(),
      created_at: new Date()
    } 

    jest.spyOn(booksRepository, 'find_by_title')
      .mockImplementationOnce(async () => book)

    await expect(
      () => 
        sut.execute({
          user_id: 'user_id',
          data: {
            title: 'Title',
            author: 'Author',
            status: 'reading',
            current_page: 50,
            total_pages: 208
          }
        })
    ).rejects.toThrow(AlreadyExistError)
  })

  it('should be able to call create with correct values', async () => {
    const booksRepositorySpy = jest.spyOn(booksRepository, 'create')

    await sut.execute({
      user_id: 'user_id',
      data: {
        title: 'Title',
        author: 'Author',
        status: 'reading',
        current_page: 50,
        total_pages: 208
      }
    })

    expect(booksRepositorySpy).toHaveBeenCalledWith({
      user_id: "user_id",
      author: "Author",
      status: "reading",
      title: "Title",
      total_pages: 208,
      current_page: 50
    })
  })
});
