import { IRedisConfig } from '@common/interfaces/configs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService {
  constructor(private readonly configService: ConfigService) {}

  getRedisHost(): string {
    return this.configService.get<IRedisConfig>('redis')!.redisHost;
  }

  getRedisPort(): number {
    return this.configService.get<IRedisConfig>('redis')!.redisPort;
  }

  getRedisTtl(): number {
    return this.configService.get<IRedisConfig>('redis')!.redisTtl;
  }
}
