import { ConfigModule, ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: configService.get<Dialect>('database.dialect'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
      });
      await sequelize.sync();
      return sequelize;
    },
    inject: [ConfigService],
  },
];
