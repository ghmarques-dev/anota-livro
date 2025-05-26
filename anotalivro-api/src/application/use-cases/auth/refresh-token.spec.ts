import { InMemoryUsersRepository } from 'src/infra/database/in-memory';
import { EncrypterSpy } from 'src/infra/cryptography/mocks';

import type { UsersRepository } from 'src/application/protocols/database';
import {
  Encrypter,
  HashComparer,
} from 'src/application/protocols/cryptography';

import { UnauthorizedError } from 'src/application/errors/errors';
import { RefreshTokenUseCase } from './refresh-token';

let usersRepository: UsersRepository;
let encrypter: Encrypter;
let sut: RefreshTokenUseCase;

describe('refresh token use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    encrypter = new EncrypterSpy();

    sut = new RefreshTokenUseCase(encrypter, usersRepository);

    await usersRepository.create({
      user_id: 'user-id',
      email: 'mail@example.com',
      password: 'hashed-password',
    });
  });

  it('should be able to find by refresh token use case with successful', async () => {
    jest
      .spyOn(encrypter, 'encrypt')
      .mockImplementationOnce(async () => 'access-token')
      .mockImplementationOnce(async () => 'refresh-token');

    const response = await sut.execute({
      refresh_token: 'refresh_token'
    });

    expect(response.access_token).toBe('access-token');
    expect(response.refresh_token).toBe('refresh-token');
    expect(response.expires_in).toBe(60 * 60 * 24 * 7); // 7 day
  });

  it('should be able to call find_by_refresh_token with correct values', async () => {
    const usersRepositorySpy = jest.spyOn(usersRepository, 'find_by_refresh_token')

    await sut.execute({
      refresh_token: 'refresh_token'
    });

    expect(usersRepositorySpy).toHaveBeenCalledWith({
      refresh_token: 'refresh_token'
    })
  })

  it("should be able to call find_by_refresh_token with invalid credentials", async () => {
    await expect(() =>
      sut.execute({
        refresh_token: 'any_refresh_token'
      })
    ).rejects.toThrow(UnauthorizedError)
  })

  it('should be able to call encrypter two times', async () => {
    const encrypterSpy = jest.spyOn(encrypter, 'encrypt');

    await sut.execute({
      refresh_token: 'refresh_token'
    });

    expect(encrypterSpy).toHaveBeenCalledTimes(2);
  });

  it('should be able to call encrypter with correct plaintext', async () => {
    const encrypterSpy = jest.spyOn(encrypter, 'encrypt');

    await sut.execute({
      refresh_token: 'refresh_token'
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
        refresh_token: 'refresh_token'
      }),
    ).rejects.toThrow();
  });
});
