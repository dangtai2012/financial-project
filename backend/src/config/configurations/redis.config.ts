import { IRedisConfig } from '@common/interfaces/configs';
import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs(
  'redis',
  (): IRedisConfig => ({
    redisHost: process.env.REDIS_HOST!,
    redisPort: parseInt(process.env.REDIS_PORT!, 10),
    redisTtl: parseInt(process.env.REDIS_TTL!, 10),
  }),
);
