import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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

    const user = await this.usersRepository.create({
      ...userDto,
      password: hashedPassword,
    });

    if (!user) throw new BadRequestException('User not created');

    delete user?.dataValues.password;
    return user;
  }

  async getUserById(id: number): Promise<User> {
    if (!id) throw new BadRequestException('ID is required');

    const user = await this.usersRepository.findByPk(id);

    if (!user) throw new BadRequestException('User not found');

    delete user?.dataValues.password;
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) throw new BadRequestException('Email is required');

    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }
}
