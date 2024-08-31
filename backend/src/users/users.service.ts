import { Inject, Injectable } from '@nestjs/common';
import { constants } from 'src/common/constants';
import { User } from './user.model';

const { USERS_PROVIDER } = constants.moduleProviders;
@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_PROVIDER)
    private readonly usersRepository: typeof User,
  ) {}

  async addUser(name: string, email: string, phone: string): Promise<User> {
    const user = await this.usersRepository.create({ name, email, phone });
    return user;
  }

  async getUserById(id: number): Promise<User> {
    return await this.usersRepository.findByPk(id);
  }
}
