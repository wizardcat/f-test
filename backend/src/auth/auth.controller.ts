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
  @Post('sign-up')
  // @UsePipes(new ValidationPipe())
  async register(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(200)
  @Post('sign-in')
  // @UsePipes(new ValidationPipe())
  async login(@Body() authDto: AuthDto, @Res() res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.signIn(authDto);
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
  @Post('sign-in/access-token')
  // @UsePipes(new ValidationPipe())
  async getNewToken(@Body() dto: RefreshTokenDto) {
    return this.authService.getNewToken(dto.refreshToken);
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
