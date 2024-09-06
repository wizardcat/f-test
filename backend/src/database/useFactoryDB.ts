import { ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';
import { AuthRefreshToken } from 'src/auth/models/auth-refresh-token.model';
import { User } from 'src/users/models/user.model';
import { createDatabase } from './create-database';

export const useFactoryDB = async (configService: ConfigService) => {
  const dialect = configService.get<Dialect>('database.dialect');
  const host = configService.get<string>('database.host');
  const port = configService.get<number>('database.port');
  const username = configService.get<string>('database.username');
  const password = configService.get<string>('database.password');
  const database = configService.get<string>('database.database');

  createDatabase({
    host,
    port,
    user: username,
    password,
    database,
  });

  return {
    dialect,
    host,
    port,
    username,
    password,
    database,
    models: [User, AuthRefreshToken],
    logging: configService.get('database.logging') === 'true',
    synchronize: process.env.NODE_ENV !== 'production',
  };
};
