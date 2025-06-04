import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMailConfig } from 'src/common/interfaces/configs';

@Injectable()
export class MailConfigService {
  constructor(private readonly configService: ConfigService) {}

  getSmtpHost(): string {
    return this.configService.get<IMailConfig>('mail')!.smtpHost;
  }

  getSmtpPort(): number {
    return this.configService.get<IMailConfig>('mail')!.smtpPort;
  }

  getSmtpUser(): string {
    return this.configService.get<IMailConfig>('mail')!.smtpUser;
  }

  getSmtpPassword(): string {
    return this.configService.get<IMailConfig>('mail')!.smtpPassword;
  }

  getMailVerifyExpiration(): number {
    return this.configService.get<IMailConfig>('mail')!.mailVerifyExpiration;
  }

  getPasswordResetExpiration(): number {
    return this.configService.get<IMailConfig>('mail')!.passwordResetExpiration;
  }
}
