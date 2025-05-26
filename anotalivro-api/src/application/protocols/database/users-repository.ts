import type { User } from 'src/domain/entities';

export abstract class UsersRepository {
  abstract create(
    input: UsersRepository.Create.Input,
  ): UsersRepository.Create.Output;

  abstract find_by_email(
    input: UsersRepository.FindByEmail.Input,
  ): UsersRepository.FindByEmail.Output;

  abstract find_by_refresh_token(
    input: UsersRepository.FindByRefreshToken.Input
  ): UsersRepository.FindByRefreshToken.Output

  abstract update(input: UsersRepository.Update.Input): UsersRepository.Update.Output
}

export namespace UsersRepository {
  export namespace Create {
    export type Input = {
      user_id?: string;
      email: string;
      password: string;
    };

    export type Output = Promise<User>;
  }

  export namespace FindByEmail {
    export type Input = {
      email: string;
    };

    export type Output = Promise<User | null>;
  }

  export namespace FindByRefreshToken {
    export type Input = {
      refresh_token: string
    }

    export type Output = Promise<User | null>
  }

  export namespace Update {
    export type Input = {
      user_id: string;
      data: Partial<{
        email: string;
        password: string;
        refresh_token: string;
      }>
    };

    export type Output = Promise<User | null>;
  }
}
