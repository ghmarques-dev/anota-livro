import { UseCaseError } from '../use-case-error';

export class AlreadyExistError extends Error implements UseCaseError {
  constructor(entity: string) {
    super(`${entity} already exists`);
  }
}
