export interface IMailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  mailVerifyExpiration: number;
  passwordResetExpiration: number;
}
