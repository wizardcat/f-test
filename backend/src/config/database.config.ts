import { registerAs } from '@nestjs/config';
import { Dialect } from 'sequelize';

const dialect: Dialect = 'mysql';

export default registerAs('database', () => ({
  dialect,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}));
