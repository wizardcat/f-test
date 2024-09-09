import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { getJwtConfig } from 'src/config/jwt.config';
import { CryptoModule } from 'src/modules/crypto/crypto.module';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRefreshToken } from './models/auth-refresh-token.model';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthRefreshTokenService,
  ],
  imports: [
    ConfigModule,
    UsersModule,
    CryptoModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    SequelizeModule.forFeature([AuthRefreshToken]),
  ],
  exports: [AuthService, SequelizeModule.forFeature([AuthRefreshToken])],
})
export class AuthModule {}
