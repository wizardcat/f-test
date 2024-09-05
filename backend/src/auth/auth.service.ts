import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { CryptoService } from 'src/crypto/crypto.service';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { AuthRefreshTokenService } from './auth-refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private cryptoService: CryptoService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  async login(res: Response, user?: Express.User) {
    if (!user?.id) {
      throw new InternalServerErrorException('User not set in request');
    }
    return this.authRefreshTokenService.generateTokenPair(user, res);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const isPassValid = await this.cryptoService.verifyHash(
      password,
      user.password,
    );

    if (isPassValid) {
      return user;
    }
    return null;
  }
}
