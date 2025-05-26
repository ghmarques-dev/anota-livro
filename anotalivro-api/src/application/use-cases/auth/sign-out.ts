import { Injectable } from '@nestjs/common';
import type { UsersRepository } from 'src/application/protocols/database';

export type ISignOutUseCaseInput = {
  user_id: string;
};

export type ISignOutUseCaseOutput = Promise<void>;

@Injectable()
export class SignOutUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: ISignOutUseCaseInput): Promise<ISignOutUseCaseOutput> {
    await this.usersRepository.update({
      user_id: input.user_id,
      data: {
        refresh_token: undefined,
      },
    });
  }
}
