import { simpleFaker } from '@faker-js/faker';

import {
  HashGenerator,
  type Encrypter,
  type HashComparer,
} from 'src/application/protocols/cryptography';

export class HashGeneratorSpy implements HashGenerator {
  plaintext: string;
  readonly digest: string = simpleFaker.string.uuid();

  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext;
    return this.digest;
  }
}

export class HashComparerSpy implements HashComparer {
  plaintext: string;
  digest: string;
  isValid = true;

  async compare(plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext;
    this.digest = digest;
    return this.isValid;
  }
}

export class EncrypterSpy implements Encrypter {
  plaintext: Record<string, unknown>;
  readonly ciphertext = simpleFaker.string.uuid();

  async encrypt(data: Record<string, unknown>): Promise<string> {
    this.plaintext = data;
    return this.ciphertext;
  }
}
