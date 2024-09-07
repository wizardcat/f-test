import { createConnection } from 'mysql2/promise';

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}
export const createDatabase = async ({
  host,
  port,
  user,
  password,
  database,
}: DatabaseConfig) => {
  const connection = await createConnection({
    host,
    port,
    user,
    password,
  });

  const [rows] = await connection.query(
    `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
    [database],
  );

  if (Array.isArray(rows) && rows.length === 0) {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  }

  await connection.end();
};
