import { RedisConfigService } from '@config/services';
import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [RedisConfigService],
      useFactory: (redisConfigService: RedisConfigService) => {
        return new Redis(
          redisConfigService.getRedisPort(),
          redisConfigService.getRedisHost(),
        );
      },
    },

    CacheService,
  ],

  exports: [CacheService],
})
export class CacheModule {}
