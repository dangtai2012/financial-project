import { RedisConfigService } from '@config/services';
import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly defaultTtl: number;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,

    /**
     * : Configs
     */
    private readonly redisConfigService: RedisConfigService,
    /*end*/
  ) {
    this.defaultTtl = this.redisConfigService.getRedisTtl();
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<string> {
    const finalTtl = ttlSeconds !== undefined ? ttlSeconds : this.defaultTtl;
    if (finalTtl > 0) {
      return this.redisClient.set(key, value, 'EX', finalTtl);
    }
    return this.redisClient.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
