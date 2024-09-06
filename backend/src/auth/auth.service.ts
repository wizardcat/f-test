import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { CryptoService } from 'src/crypto/crypto.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { AuthRefreshTokenService } from './auth-refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private cryptoService: CryptoService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  async register(res: Response, user?: CreateUserDto) {
    if (!user?.email || !user?.password) {
      throw new InternalServerErrorException(
        'User credentials not set in request',
      );
    }
    const newUser = await this.usersService.addUser(user);

    return this.authRefreshTokenService.generateTokenPair(newUser, res);
  }

  async login(res: Response, user?: Express.User) {
    if (!user?.id) {
      throw new InternalServerErrorException('User not set in request');
    }
    return this.authRefreshTokenService.generateTokenPair(user, res);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserByEmail(email);
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
