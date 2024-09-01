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

  async signUp(authDto: AuthDto) {
    const { email } = authDto;
    const user = await this.user.getUser(email);

    if (user) throw new BadRequestException('User alrady exists');

    const newUser = await this.user.addUser(authDto);
    const tokens = await this.issueTokens(newUser.id);

    return {
      user: newUser,
      ...tokens,
    };
  }

  async signIn(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  async getNewToken(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.user.getUserById(result.id);

    const tokens = await this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  private async issueTokens(userId: number) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(authDto: AuthDto) {
    const { email, password } = authDto;
    const user = await this.user.getUser(email);

    if (!user) throw new NotFoundException('User not found');

    const isPassValid = await verify(user.password, password);

    if (!isPassValid) throw new UnauthorizedException('Invalid password');

    return user;
  }
}
