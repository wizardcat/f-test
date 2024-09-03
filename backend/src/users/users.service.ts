import { Inject, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { constants } from 'src/common/constants';
import { UserDto } from './dto/user.dto';
import { User } from './user.model';

const { USERS_PROVIDER } = constants.moduleProviders;
@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_PROVIDER)
    private readonly usersRepository: typeof User,
  ) {}

  async addUser(userDto: UserDto): Promise<User> {
    const hashedPassword = await hash(userDto.password);
    console.log('create:', {
      ...userDto,
      password: hashedPassword,
    });

    const user = await this.usersRepository.create({
      ...userDto,
      password: hashedPassword,
    });
    return user;
  }

  async getUserById(id: number): Promise<User> {
    return await this.usersRepository.findByPk(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }
}
