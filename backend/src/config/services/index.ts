import { AppConfigService } from './app_config.service';
import { DatabaseConfigService } from './database_config.service';
import { JwtConfigService } from './jwt_config.service';
import { MailConfigService } from './mail_config.service';
import { RedisConfigService } from './redis_config.service';

export const configServices = [
  AppConfigService,
  DatabaseConfigService,
  JwtConfigService,
  RedisConfigService,
  MailConfigService,
];

export {
  AppConfigService,
  DatabaseConfigService,
  JwtConfigService,
  RedisConfigService,
  MailConfigService,
};
