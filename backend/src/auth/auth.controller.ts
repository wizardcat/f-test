import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('register')
  async register(@Body() authDto: AuthDto) {
    return this.authService.register(authDto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() authDto: AuthDto, @Res() res: Response) {
    const credentials = await this.authService.login(authDto);
    const { accessToken, refreshToken, user } = credentials;

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      // sameSite: 'strict',
      sameSite: 'none',
    });
    res.cookie('test_cookie', 'test');

    return res.json({ user, accessToken });
  }

  @HttpCode(200)
  @Post('login/access-token')
  async getNewToken(@Body() rtDto: RefreshTokenDto) {
    return this.authService.getNewToken(rtDto.refreshToken);
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const newAccessToken = await this.authService.refresh(refreshToken);
    return res.json({ accessToken: newAccessToken });
  }
}
