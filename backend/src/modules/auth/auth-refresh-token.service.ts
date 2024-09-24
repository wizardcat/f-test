import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CryptoService } from 'src/modules/crypto/crypto.service';
import { User } from 'src/modules/users/models/user.model';
import { AuthRefreshToken } from './models/auth-refresh-token.model';

@Injectable()
export class AuthRefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private cryptoService: CryptoService,
    @InjectModel(AuthRefreshToken)
    private authRefreshTokenModel: typeof AuthRefreshToken,
    @InjectModel(User)
    private readonly usersModel: typeof User,
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

      const isRefreshTokenInBlackList = await this.isRefreshTokenBlackListed(
        hashedRefreshToken,
        authUser.id,
      );

      if (isRefreshTokenInBlackList) {
        throw new UnauthorizedException('Invalid refresh token.');
      }
      await this.authRefreshTokenModel.create({
        hashedRefreshToken,
        expiresAt: currentRefreshTokenExpiresAt,
        userId: authUser.id,
      });
    }

    return newRefreshToken;
  }

  async generateTokenPair(user: Express.User, currentRefreshToken?: string) {
    if (!user || !user.id) {
      throw new InternalServerErrorException('User not found');
    }

    const isUserExists = await this.usersModel.findByPk(user.id, {});

    if (!isUserExists) {
      throw new InternalServerErrorException('User not found');
    }

    const payload = { sub: user.id };
    const currentRefreshTokenExpiresAt = user.refreshTokenExpiresAt;

    const refreshToken = await this.generateRefreshToken(
      user,
      currentRefreshToken,
      currentRefreshTokenExpiresAt,
    );

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      refreshToken,
    };
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

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async clearExpiredRefreshTokens() {
    await this.authRefreshTokenModel.destroy({
      where: {
        expiresAt: {
          [Op.lte]: new Date(),
        },
      },
    });
  }
}
