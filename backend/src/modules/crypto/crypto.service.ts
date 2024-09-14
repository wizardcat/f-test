import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  async generateHash(password: string): Promise<string> {
    const salt = crypto.randomBytes(16);
    const hashed = await hash(password, { salt });
    return hashed;
  }

  async verifyHash(password: string, hash: string): Promise<boolean> {
    return verify(hash, password);
  }

  generateSha256HashBase64(text: string): string {
    return crypto.createHash('sha256').update(text).digest('base64');
  }
}
