import { CacheModule } from './cache/cache.module';
import { LoggerModule } from './logger/logger.module';
import { MailModule } from './mail/mail.module';

export const shareds = [LoggerModule, CacheModule, MailModule];
