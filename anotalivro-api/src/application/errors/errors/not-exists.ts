import { UseCaseError } from '../use-case-error';

export class NotExistsError extends Error implements UseCaseError {
  constructor(entity: string) {
    super(`${entity} not exists`);
    this.name = 'NotExistsError'
  }
}
