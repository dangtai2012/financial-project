import * as Joi from 'joi';

export const MailConfigValidation = {
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  MAIL_VERIFY_EXPIRATION: Joi.number().required(),
  PASSWORD_RESET_EXPIRATION: Joi.number().required(),
};
