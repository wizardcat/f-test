import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { extractRefreshTokenFromCookies } from 'src/utils/cookies';

interface JwtRefreshPayload {
  sub: number;
  exp: number;
  iat?: number;
  [key: string]: any;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => extractRefreshTokenFromCookies(req),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
    });
  }

  async validate(payload: JwtRefreshPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid refresh jwt payload.');
    }
    return {
      id: payload.sub,
      refreshTokenExpiresAt: new Date(payload.exp * 1000),
    };
  }
}
