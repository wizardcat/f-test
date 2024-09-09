import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Response } from 'express';
import { CryptoService } from 'src/modules/crypto/crypto.service';
import { cookieConfig } from 'src/utils/cookies';
import { AuthRefreshToken } from './models/auth-refresh-token.model';

@Injectable()
export class AuthRefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private cryptoService: CryptoService,
    @InjectModel(AuthRefreshToken)
    private authRefreshTokenModel: typeof AuthRefreshToken,
  ) {}

  async generateRefreshToken(
    authUser: Express.User,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const newRefreshToken = this.jwtService.sign(
      { sub: authUser.id },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      },
    );

    if (currentRefreshToken && currentRefreshTokenExpiresAt) {
      const hashedRefreshToken =
        this.cryptoService.generateSha256HashBase64(currentRefreshToken);

      await this.authRefreshTokenModel.create({
        hashedRefreshToken,
        expiresAt: currentRefreshTokenExpiresAt,
        userId: authUser.id,
      });
    }

    return newRefreshToken;
  }

  private isRefreshTokenBlackListed(
    hashedRefreshToken: string,
    userId: number,
  ) {
    return this.authRefreshTokenModel.findOne({
      where: {
        hashedRefreshToken,
        userId,
      },
      raw: true,
    });
  }

  async generateTokenPair(
    user: Express.User,
    res: Response,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const payload = { sub: user.id };

    res.cookie(
      cookieConfig.refreshToken.name,
      await this.generateRefreshToken(
        user,
        currentRefreshToken,
        currentRefreshTokenExpiresAt,
      ),
      {
        ...cookieConfig.refreshToken.options,
      },
    );

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
