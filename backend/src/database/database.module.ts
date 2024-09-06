import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { useFactoryDB } from './useFactoryDB';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: useFactoryDB,
    }),
  ],
})
export class DatabaseModule {}
