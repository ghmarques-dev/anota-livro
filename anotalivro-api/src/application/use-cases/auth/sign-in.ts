import { Injectable } from '@nestjs/common';
import { InvalidCredentialError } from 'src/application/errors/errors';
import { NotExistsError } from 'src/application/errors/errors/not-exists';

import type {
  Encrypter,
  HashComparer,
} from 'src/application/protocols/cryptography';
import type { UsersRepository } from 'src/application/protocols/database';

export type ISignInUseCaseInput = {
  email: string;
  password: string;
};

export type ISignInUseCaseOutput = Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}>;

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly hashCompare: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(input: ISignInUseCaseInput): ISignInUseCaseOutput {
    const user = await this.usersRepository.find_by_email({
      email: input.email,
    });

    if (!user) {
      throw new NotExistsError('User');
    }

    const isPasswordMatch = await this.hashCompare.compare(
      input.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new InvalidCredentialError();
    }

    const payload = {
      sub: user.user_id,
      email: user.email,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.encrypter.encrypt(payload),
      this.encrypter.encrypt(payload),
    ]);

    await this.usersRepository.update({
      user_id: user.user_id,
      data: {
        refresh_token,
      },
    });

    return {
      access_token,
      refresh_token,
      expires_in: 60 * 60 * 24 * 7, // 7 day
    };
  }
}
