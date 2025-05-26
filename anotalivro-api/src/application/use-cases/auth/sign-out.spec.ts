import { InMemoryUsersRepository } from 'src/infra/database/in-memory';
import { HashGeneratorSpy } from 'src/infra/cryptography/mocks';

import type { UsersRepository } from 'src/application/protocols/database';
import type { HashGenerator } from 'src/application/protocols/cryptography';

import { SignOutUseCase } from './sign-out';

let usersRepository: UsersRepository;
let sut: SignOutUseCase;

describe('sign out use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();

    sut = new SignOutUseCase(usersRepository);

    await usersRepository.create({
      user_id: 'user-id',
      email: 'mail@example.com',
      password: 'hashed-password',
    });
  });

  it('should be able to sign out with successful', async () => {
    await expect(sut.execute({
      user_id: 'user-id'
    })).resolves.toBeUndefined();
  });

  it('should be able to call update with correct email', async () => {
    const userRepositorySpy = jest.spyOn(usersRepository, 'update');

    await sut.execute({
      user_id: 'user-id'
    });

    expect(userRepositorySpy).toHaveBeenCalledWith({
      user_id: 'user-id',
      data: {
        refresh_token: undefined
      }
    });
  });
});
