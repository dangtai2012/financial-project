import { registerAs } from '@nestjs/config';
import { IMailConfig } from 'src/common/interfaces/configs';

export const mailConfig = registerAs(
  'mail',
  (): IMailConfig => ({
    smtpHost: process.env.SMTP_HOST!,
    smtpPort: parseInt(process.env.SMTP_PORT!, 10),
    smtpUser: process.env.SMTP_USER!,
    smtpPassword: process.env.SMTP_PASSWORD!,
    mailVerifyExpiration: parseInt(process.env.MAIL_VERIFY_EXPIRATION!, 10),
    passwordResetExpiration: parseInt(
      process.env.PASSWORD_RESET_EXPIRATION!,
      10,
    ),
  }),
);
