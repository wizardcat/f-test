import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CryptoModule } from 'src/crypto/crypto.module';
import { User } from './models/user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  // providers: [UsersService, ...usersProviders],
  providers: [UsersService],
  controllers: [UsersController],
  // imports: [CryptoModule, SequelizeModule.forFeature([User])],
  imports: [CryptoModule, SequelizeModule.forFeature([User])],
  exports: [UsersService, SequelizeModule.forFeature([User])],
})
export class UsersModule {}
