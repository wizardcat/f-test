import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../../users/models/user.model';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authenticationService.validateUser(
      username,
      password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
