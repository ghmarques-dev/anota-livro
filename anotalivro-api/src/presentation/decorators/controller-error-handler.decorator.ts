import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import {
  HttpConflictError,
  HttpInternalServerError,
  HttpNotFoundError,
  HttpUnauthorizedError,
  HttpUnprocessableEntityError,
} from 'src/presentation/helpers';

export function ControllerErrorHandlerDecorator() {
  return (target: any, _: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (
          [
            'UnauthorizedError',
          ].includes(error.name)
        ) {
          throw new UnauthorizedException(HttpUnauthorizedError(error));
        }

        if (
          ['NotExistsError'].includes(error.name)
        ) {
          throw new NotFoundException(HttpNotFoundError(error));
        }

        if (['AlreadyExistError'].includes(error.name)) {
          throw new ConflictException(HttpConflictError(error));
        }

        if (['InvalidCredentialError'].includes(error.name)) {
          throw new UnprocessableEntityException(
            HttpUnprocessableEntityError(error),
          );
        }

        throw new InternalServerErrorException(
          HttpInternalServerError(error.message),
        );
      }
    };
  };
}
