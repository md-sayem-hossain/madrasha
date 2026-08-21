/**
 * MySQL Database Adapter
 * Used when running locally or in production with MySQL database
 * Follows the configuration parameters provided in .env.mysql.backup
 */

export interface MySQLConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
}

export const getMySQLConfigFromEnv = (): MySQLConfig => {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_NAME || 'madrasa_db'
  };
};

/**
 * Helper to check if MySQL connection parameters are supplied
 */
export const isMySQLEnabled = (): boolean => {
  return !!(process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_NAME);
};

export default {
  getMySQLConfigFromEnv,
  isMySQLEnabled
};
