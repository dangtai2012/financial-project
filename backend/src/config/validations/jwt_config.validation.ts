import * as Joi from 'joi';

export const JwtConfigValidation = {
  JWT_SECRET: Joi.string().required(),
  JWT_AUDIENCE: Joi.string().optional(),
  JWT_ISSUER: Joi.string().optional(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.number().required(),
};
