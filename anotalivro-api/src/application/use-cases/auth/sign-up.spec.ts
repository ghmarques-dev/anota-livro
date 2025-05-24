import { InMemoryUsersRepository } from 'src/infra/database/in-memory';
import { HashGeneratorSpy } from 'src/infra/cryptography/mocks';

import type { UsersRepository } from 'src/application/protocols/database';
import type { HashGenerator } from 'src/application/protocols/cryptography';

import { SignUpUseCase } from './sign-up';
import type { User } from 'src/domain/entities';
import { AlreadyExistError } from 'src/application/errors/errors/already-exists';

let usersRepository: UsersRepository;
let hashGenerator: HashGenerator;
let sut: SignUpUseCase;

describe('sign up use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    hashGenerator = new HashGeneratorSpy();

    sut = new SignUpUseCase(hashGenerator, usersRepository);
  });

  it('should be able to create user with successful', async () => {
    const { user } = await sut.execute({
      email: 'mail@example.com',
      password: 'hashed-password',
    });

    expect(user.user_id).toBe('user_id');
    expect(user.email).toBe('mail@example.com');
    expect(user.password).toBeDefined();
    expect(user.books).toHaveLength(0);
    expect(user.refresh_token).toBeDefined();
    expect(user.created_at).toBeDefined();
    expect(user.updated_at).toBeDefined();
  });

  it('should be able to call find_by_email with correct email', async () => {
    const userRepositorySpy = jest.spyOn(usersRepository, 'find_by_email');

    await sut.execute({
      email: 'mail@example.com',
      password: 'hashed-password',
    });

    expect(userRepositorySpy).toHaveBeenCalledWith({
      email: 'mail@example.com',
    });
  });

  it('should be able to return error if find_by_email return one user', async () => {
    const user: User = {
      user_id: 'user_id',
      email: 'mail@example.com',
      password: 'hashed-password',
      books: [],
      refresh_token: 'auth_token',
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest
      .spyOn(usersRepository, 'find_by_email')
      .mockImplementationOnce(async () => user);

    await expect(() =>
      sut.execute({
        email: 'mail@example.com',
        password: 'hashed-password',
      }),
    ).rejects.toThrow(AlreadyExistError);
  });

  it('should be able to call hashGenerator with correct password', async () => {
    const hashGeneratorSpy = jest.spyOn(hashGenerator, 'hash');

    await sut.execute({
      email: 'mail@example.com',
      password: 'hashed-password',
    });

    expect(hashGeneratorSpy).toHaveBeenCalledWith('hashed-password');
  });

  it('should be able to call usersRepository with correct data', async () => {
    const usersRepositorySpy = jest.spyOn(usersRepository, 'create');

    await sut.execute({
      email: 'mail@example.com',
      password: 'hashed-password',
    });

    expect(usersRepositorySpy).toHaveBeenCalledWith({
      email: 'mail@example.com',
      password: expect.any(String),
    });
  });
});
