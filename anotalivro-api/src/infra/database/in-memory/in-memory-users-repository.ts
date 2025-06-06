import type { UsersRepository } from 'src/application/protocols/database';
import { User } from 'src/domain/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  private database: User[] = [];

  async create(
    input: UsersRepository.Create.Input,
  ): UsersRepository.Create.Output {
    const user: User = {
      user_id: input.user_id ?? 'user_id',
      email: input.email,
      password: input.password,
      books: [],
      refresh_token: 'refresh_token',
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.database.push(user);

    return user;
  }

  async find_by_email(
    input: UsersRepository.FindByEmail.Input,
  ): UsersRepository.FindByEmail.Output {
    const user = this.database.find((item) => item.email === input.email);

    if (!user) {
      return null;
    }

    return user;
  }

  async find_by_refresh_token(
    input: UsersRepository.FindByRefreshToken.Input
  ): UsersRepository.FindByRefreshToken.Output {
    const userByRefreshToken = this.database.find(item => item.refresh_token === input.refresh_token)

    if(!userByRefreshToken) {
      return null
    }

    return userByRefreshToken
  }

  async update(
    input: UsersRepository.Update.Input,
  ): UsersRepository.Update.Output {
    const index = this.database.findIndex(
      (item) => item.user_id == input.user_id,
    );

    const user = this.database[index];

    if (!user) {
      return null
    }
    
    const assignUser = Object.assign(user, input.data);

    this.database[index] = assignUser;

    return assignUser;
  }
}
