import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { factories } from './seeds/factories';
import { MainSeeder } from './seeds/seeders/main_seeder';

dotenv.config();

export const typeormOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [join(__dirname, '../src/database/entities/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/migrations/**/*{.ts,.js}')],
  factories: factories,
  seeds: [MainSeeder],
};
