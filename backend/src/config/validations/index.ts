import * as Joi from 'joi';
import { AppConfigValidation } from './app_config.validation';
import { DatabaseConfigValidation } from './database_config.validation';
import { JwtConfigValidation } from './jwt_config.validation';
import { RedisConfigValidation } from './redis_config.validation';
import { MailConfigValidation } from './mail.config.validation';

export const configValidations = Joi.object({
  ...AppConfigValidation,
  ...DatabaseConfigValidation,
  ...JwtConfigValidation,
  ...RedisConfigValidation,
  ...MailConfigValidation,
});
