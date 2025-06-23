import { REDIS } from '@common/constants';
import { EEntityPrefix } from '@common/constants/enums';
import { Injectable } from '@nestjs/common';
import { CacheService } from '@shared/cache/cache.service';

@Injectable()
export class IdGeneratorService {
  constructor(
    /**
     * : Services
     */
    private readonly cacheService: CacheService,
    /*end*/
  ) {}

  async generate(prefix: EEntityPrefix): Promise<string> {
    const timestampInMilliseconds = Date.now();

    const sequenceKey = `${REDIS.SEQUENCE}:${prefix}:${timestampInMilliseconds}`;

    const sequence =
      await this.cacheService.incrementSequenceForIdGeneration(sequenceKey);

    const paddedSequence = sequence.toString().padStart(3, '0');

    return `${prefix}-${timestampInMilliseconds}-${paddedSequence}`;
  }
}
