import { registerAs } from '@nestjs/config';
import { IDatabaseConfig } from 'src/common/interfaces/configs';

export const databaseConfig = registerAs(
  'database',
  (): IDatabaseConfig => ({
    dbType: process.env.DB_TYPE!,
    dbHost: process.env.DB_HOST!,
    dbPort: parseInt(process.env.DB_PORT!, 10),
    dbUsername: process.env.DB_USERNAME!,
    dbPassword: process.env.DB_PASSWORD!,
    dbDatabase: process.env.DB_DATABASE!,
    // Convert string to boolean
    dbSynchronize: process.env.DB_SYNCHRONIZE === 'true',
    dbLogging: process.env.DB_LOGGING === 'true',
  }),
);
