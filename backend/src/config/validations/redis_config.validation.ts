import * as Joi from 'joi';

export const RedisConfigValidation = {
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_TTL: Joi.number().default(60),
};
