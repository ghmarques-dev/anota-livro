import { InMemoryUsersRepository } from 'src/infra/database/in-memory';
import { EncrypterSpy, HashComparerSpy } from 'src/infra/cryptography/mocks';

import type { UsersRepository } from 'src/application/protocols/database';
import {
  Encrypter,
  HashComparer,
} from 'src/application/protocols/cryptography';

import type { User } from 'src/domain/entities';
import { SignInUseCase } from './sign-in';
import { NotExistsError } from 'src/application/errors/errors/not-exists';
import { InvalidCredentialError } from 'src/application/errors/errors';

let usersRepository: UsersRepository;
let hashComparer: HashComparer;
let encrypter: Encrypter;
let sut: SignInUseCase;

describe('sign in use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    hashComparer = new HashComparerSpy();
    encrypter = new EncrypterSpy();

    sut = new SignInUseCase(hashComparer, encrypter, usersRepository);

    await usersRepository.create({
      user_id: 'user-id',
      email: 'mail@example.com',
      password: 'hashed-password',
    });
  });

  it('should be able to sign-in user with successful', async () => {
    jest
      .spyOn(encrypter, 'encrypt')
      .mockImplementationOnce(async () => 'access-token')
      .mockImplementationOnce(async () => 'refresh-token');

    const response = await sut.execute({
      email: 'mail@example.com',
      password: 'JohnDoe#123',
    });

    expect(response.access_token).toBe('access-token');
    expect(response.refresh_token).toBe('refresh-token');
    expect(response.expires_in).toBe(60 * 60 * 24 * 7); // 7 day
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

  it('should be able to return error if find_by_email return no user', async () => {
    jest
      .spyOn(usersRepository, 'find_by_email')
      .mockImplementationOnce(async () => null);

    await expect(() =>
      sut.execute({
        email: 'mail@example.com',
        password: 'hashed-password',
      }),
    ).rejects.toThrow(NotExistsError);
  });

  it('should be able to call hashComparer with correct values', async () => {
    const user: User = {
      user_id: 'user_id',
      email: 'mail@example.com',
      password: 'hashed-password',
      books: [],
      refresh_token: 'refresh_token',
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest
      .spyOn(usersRepository, 'find_by_email')
      .mockImplementationOnce(async () => user);
    const hashComparerSpy = jest.spyOn(hashComparer, 'compare');

    await sut.execute({
      email: 'mail@example.com',
      password: 'hashed-password',
    });

    expect(hashComparerSpy).toHaveBeenCalledWith(
      'hashed-password',
      'hashed-password',
    );
  });

  it('should be able to call hashComparer with error', async () => {
    jest
      .spyOn(hashComparer, 'compare')
      .mockImplementationOnce(async () => false);

    await expect(() =>
      sut.execute({
        email: 'mail@example.com',
        password: 'hashed-password',
      }),
    ).rejects.toThrow(InvalidCredentialError);
  });

  it('should be able to call encrypter two times', async () => {
    const encrypterSpy = jest.spyOn(encrypter, 'encrypt');

    await sut.execute({
      email: 'mail@example.com',
      password: 'JohnDoe#123',
    });

    expect(encrypterSpy).toHaveBeenCalledTimes(2);
  });

  it('should be able to call encrypter with correct plaintext', async () => {
    const encrypterSpy = jest.spyOn(encrypter, 'encrypt');

    await sut.execute({
      email: 'mail@example.com',
      password: 'JohnDoe#123',
    });

    expect(encrypterSpy).toHaveBeenCalledWith({
      sub: 'user-id',
      email: 'mail@example.com',
    });
  });

  it('should be able to throw if encrypter throws', async () => {
    jest.spyOn(encrypter, 'encrypt').mockImplementationOnce(async () => {
      throw new Error();
    });

    await expect(() =>
      sut.execute({
        email: 'mail@example.com',
        password: 'JohnDoe#123',
      }),
    ).rejects.toThrow();
  });
});
