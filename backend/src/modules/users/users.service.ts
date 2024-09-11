import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CryptoService } from 'src/modules/crypto/crypto.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User)
    private readonly usersModel: typeof User,
    private cryptoService: CryptoService,
  ) {}

  async addUser({ email, password, ...rest }: CreateUserDto) {
    const existingUser = await this.getUserByEmail(email);

    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists.`);
    }

    const hashedPassword = await this.cryptoService.generateHash(password);

    try {
      const user = await this.usersModel.create({
        ...rest,
        email,
        password: hashedPassword,
      });
      console.log('Created user: ', user);
      return user;
    } catch (err) {
      this.logger.error('Error creating user:', err.message);
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const user = await this.usersModel.findByPk(id, {
        raw: true,
      });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }

      return user;
    } catch (err) {
      this.logger.error('Error fetching user by ID:', err.message);
      throw new InternalServerErrorException('Error fetching user.');
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.usersModel.findOne({
        where: { email },
        raw: true,
      });

      return user || null;
    } catch (err) {
      this.logger.error('Error fetching user by email:', err.message);
      throw new InternalServerErrorException('Error fetching user by email.');
    }
  }
}
