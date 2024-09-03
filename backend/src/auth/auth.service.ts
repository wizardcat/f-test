import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly user: UsersService,
  ) {}

  async register(authDto: AuthDto) {
    const { email } = authDto;

    if (!email) throw new BadRequestException('Email is required');

    const user = await this.user.getUserByEmail(email);

    if (user) throw new BadRequestException('User alrady exists');

    const newUser = await this.user.addUser(authDto);

    if (!newUser) throw new BadRequestException('User not created');

    console.log('A new user has been created: ', newUser);

    const tokens = await this.issueTokens(newUser.id);

    return {
      user: newUser,
      ...tokens,
    };
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.issueTokens(user.id);
    delete user.dataValues.password;
    console.log('Logged in user: ', user);

    return {
      user,
      ...tokens,
    };
  }

  async getNewToken(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.user.getUserById(result.id);

    if (!user) throw new NotFoundException('User not found');

    const tokens = await this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }
  async refresh(refreshToken: string): Promise<string> {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken);

      const newAccessToken = this.jwt.sign(
        { sub: payload.sub, email: payload.email },
        { expiresIn: '15m' },
      );
      return newAccessToken;
    } catch (e) {
      throw new UnauthorizedException(`Invalid refresh token: ${e.message}`);
    }
  }

  private async issueTokens(userId: number) {
    const payload = { id: userId };

    const accessToken = this.jwt.sign(payload, {
      // expiresIn: 5,
      expiresIn: '15m',
    });

    const refreshToken = this.jwt.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(authDto: AuthDto) {
    const { email, password } = authDto;
    const user = await this.user.getUserByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    const isPassValid = await verify(user.password, password);

    if (!isPassValid) throw new UnauthorizedException('Invalid password');

    return user;
  }
}
