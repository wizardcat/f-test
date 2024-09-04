import { ConfigModule, ConfigService } from '@nestjs/config';
import { createConnection } from 'mysql2/promise';
import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/user.model';
import { constants } from '../common/constants';

export const databaseProviders = [
  {
    provide: constants.DB_PROVIDER,
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      const dialect = configService.get<Dialect>('database.dialect');
      const host = configService.get<string>('database.host');
      const port = configService.get<number>('database.port');
      const username = configService.get<string>('database.username');
      const password = configService.get<string>('database.password');
      const database = configService.get<string>('database.database');

      const connection = await createConnection({
        host,
        port,
        user: username,
        password,
      });

      const [rows] = await connection.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
        [database],
      );

      if (Array.isArray(rows) && rows.length === 0) {
        await connection.query(
          `CREATE DATABASE IF NOT EXISTS \`${database}\`;`,
        );
      }
      await connection.end();

      const sequelize = new Sequelize({
        dialect,
        host,
        port,
        username,
        password,
        database,
      });

      sequelize.addModels([User]);
      await sequelize.sync({ alter: true });
      return sequelize;
    },
    inject: [ConfigService],
  },
];
