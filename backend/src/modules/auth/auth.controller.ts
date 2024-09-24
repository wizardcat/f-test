import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UserLoginDto } from 'src/modules/users/dto/user-login.dto';
import { UsersService } from 'src/modules/users/users.service';
import {
  cookieConfig,
  extractRefreshTokenFromCookies,
} from 'src/utils/cookies';
import { UserResponse } from '../users/transformers/user.response.transformer';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { User } from './decorators/user.decorator';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private readonly authService: AuthService,
    private authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  @Throttle({
    short: { limit: 2, ttl: 1000 },
    long: { limit: 5, ttl: 60000 },
  })
  @Public()
  @ApiBody({ type: CreateUserDto })
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.register(res, createUserDto);
  }

  @Throttle({
    short: { limit: 2, ttl: 1000 },
    long: { limit: 5, ttl: 60000 },
  })
  @ApiBody({ type: UserLoginDto })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(res, req.user);
  }

  @ApiBearerAuth()
  @Get('profile')
  @UseInterceptors(ClassSerializerInterceptor)
  async profile(
    @User() authUser: Express.User,
    @Res({ passthrough: true }) res: Response<UserResponse>,
  ) {
    if (!authUser || !authUser.id) {
      throw new InternalServerErrorException('Invalid user profile');
    }
    res.header('Cache-Control', 'no-store');
    return this.usersService
      .getUserById(authUser.id)
      .then((user) => new UserResponse(user));
  }

  @Throttle({
    short: { limit: 1, ttl: 1000 },
    long: { limit: 2, ttl: 60000 },
  })
  @ApiBearerAuth()
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-tokens')
  refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user } = req;

    if (!user) {
      throw new InternalServerErrorException();
    }

    const currentRefreshToken = extractRefreshTokenFromCookies(req);

    return this.authRefreshTokenService.generateTokenPair(
      user,
      res,
      currentRefreshToken,
    );
  }

  @Public()
  @Post('clear-auth-cookie')
  clearAuthCookie(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(cookieConfig.refreshToken.name);
  }
}
