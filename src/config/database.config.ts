import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'postgres',

  // This matches all .entity.ts/.js files inside all modules/entities folders
  entities: [__dirname + '/../modules/**/entities/*.entity.{ts,js}'],

  // This matches migration files in root/migrations folder
  migrations: [__dirname + '/../../migrations/*.{ts,js}'],

  // Always use migrations in production!
  synchronize: false,

  logging: process.env.TYPEORM_LOGGING === 'true',

  // Use snake_case everywhere in DB
  namingStrategy: new SnakeNamingStrategy(),

  // SSL config (uncomment for production if needed)
  // ssl: process.env.DB_SSL === 'true',
  // extra: {
  //   ssl: process.env.DB_SSL === 'true'
  //     ? { rejectUnauthorized: false }
  //     : undefined,
  // },

  // Connection pool example (uncomment and tune for prod)
  // extra: {
  //   max: 10, // max connections
  //   min: 2,
  // },
});

export default databaseConfig;
