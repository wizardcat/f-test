import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'src/config/jwt.config';
import { CryptoModule } from 'src/crypto/crypto.module';
import { UsersModule } from 'src/users/users.module';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { AuthController } from './auth.controller';
import { authProviders } from './auth.providers';
import { AuthService } from './auth.service';
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

    // UsersService,
    // ...usersProviders,
    AuthRefreshTokenService,
    ...authProviders,
  ],
  imports: [
    ConfigModule,
    UsersModule,
    CryptoModule,
    JwtModule.registerAsync({
      // imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
