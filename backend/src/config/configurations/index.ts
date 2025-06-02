import { appConfig } from './app.config';
import { databaseConfig } from './database.config';
import { jwtConfig } from './jwt.config';
import { mailConfig } from './mail.config';
import { redisConfig } from './redis.config';
import { winstonConfig } from './winston.config';

export const configurations = [
  appConfig,
  databaseConfig,
  jwtConfig,
  redisConfig,
  mailConfig,
];

export { winstonConfig };
