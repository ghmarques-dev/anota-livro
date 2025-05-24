import { Injectable } from '@nestjs/common';

import { AlreadyExistError } from 'src/application/errors/errors/already-exists';
import type { HashGenerator } from 'src/application/protocols/cryptography';
import type { UsersRepository } from 'src/application/protocols/database';

import type { User } from 'src/domain/entities';

export type ISignUpUseCaseInput = {
  email: string;
  password: string;
};

export type ISignUpUseCaseOutput = Promise<{
  user: User;
}>;

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly hashGenerator: HashGenerator,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(input: ISignUpUseCaseInput): ISignUpUseCaseOutput {
    const userAlreadyExists = await this.usersRepository.find_by_email({
      email: input.email,
    });

    if (userAlreadyExists) {
      throw new AlreadyExistError('User');
    }

    const { email, password } = input;

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
    });

    return { user };
  }
}
