import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { CryptoService } from 'src/modules/crypto/crypto.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';

// const { USERS_PROVIDER } = constants.moduleProviders;
@Injectable()
export class UsersService {
  constructor(
    // @Inject(USERS_PROVIDER)
    @InjectModel(User)
    private readonly usersModel: typeof User,
    private cryptoService: CryptoService,
  ) {}

  async addUser({ password, ...rest }: CreateUserDto) {
    const hashedPassword = await this.cryptoService.generateHash(password);

    return await this.usersModel
      .create({
        ...rest,
        password: hashedPassword,
      })
      .catch((err) => {
        console.log('user creation error: ', err);
        throw err;
      });
  }

  async getUserById(
    id: number,
    options?: FindOptions<User>,
  ): Promise<User | null> {
    const user = await this.usersModel.findOne({
      ...options,
      where: {
        ...options?.where,
        id,
      },
      raw: true,
    });

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.usersModel.findOne({
      where: {
        email,
      },
      raw: true,
    });

    return user;
  }
}
