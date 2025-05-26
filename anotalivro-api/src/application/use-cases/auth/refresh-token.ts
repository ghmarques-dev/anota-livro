import { Injectable } from '@nestjs/common';
import { UnauthorizedError } from 'src/application/errors/errors';

import type {
  Encrypter,
} from 'src/application/protocols/cryptography';
import type { UsersRepository } from 'src/application/protocols/database';

export type IRefreshTokenCaseInput = {
  refresh_token: string
};

export type IRefreshTokenCaseOutput = Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}>;

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(input: IRefreshTokenCaseInput): IRefreshTokenCaseOutput {
    const userByRefreshToken = await this.usersRepository.find_by_refresh_token({
      refresh_token: input.refresh_token
    });

    if (!userByRefreshToken) {
      throw new UnauthorizedError();
    }

    const payload = {
      sub: userByRefreshToken.user_id,
      email: userByRefreshToken.email,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.encrypter.encrypt(payload),
      this.encrypter.encrypt(payload),
    ]);

    await this.usersRepository.update({
      user_id: userByRefreshToken.user_id,
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
