import { UseCaseError } from '../use-case-error';

export class InvalidCredentialError extends Error implements UseCaseError {
  constructor() {
    super('Invalid credentials');
    this.name = 'InvalidCredentialError'
  }
}
