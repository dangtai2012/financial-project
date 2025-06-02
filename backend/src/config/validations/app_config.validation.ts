import * as Joi from 'joi';

export const AppConfigValidation = {
  APP_NAME: Joi.string().required(),
  APP_HOST: Joi.string().required(),
  APP_PORT: Joi.number().required(),
  APP_URL: Joi.string().required(),
  API_PREFIX: Joi.string().required(),
  API_VERSION: Joi.string().required(),
};
