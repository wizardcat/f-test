import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  async generateHash(passport: string): Promise<string> {
    const hashed = await hash(passport);
    return hashed;
  }

  async verifyHash(passport: string, hash: string): Promise<boolean> {
    return verify(hash, passport);
  }

  generateSha256HashBase64(text: string): string {
    return crypto.createHash('sha256').update(text).digest('base64');
  }
}
