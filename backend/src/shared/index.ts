import { CacheModule } from './cache/cache.module';
import { IdGeneratorModule } from './id_generator/id_generator.module';
import { LoggerModule } from './logger/logger.module';
import { MailModule } from './mail/mail.module';

export const shareds = [
  IdGeneratorModule,
  LoggerModule,
  CacheModule,
  MailModule,
];
