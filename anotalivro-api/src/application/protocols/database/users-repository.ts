import type { User } from 'src/domain/entities';

export abstract class UsersRepository {
  abstract create(
    input: UsersRepository.Create.Input,
  ): UsersRepository.Create.Output;

  abstract find_by_email(
    input: UsersRepository.FindByEmail.Input,
  ): UsersRepository.FindByEmail.Output;
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
}
