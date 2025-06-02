import { MailConfigService } from '@config/services';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [MailConfigService],
      useFactory: async (mailConfigService: MailConfigService) => ({
        transport: {
          host: mailConfigService.getSmtpHost(),
          port: mailConfigService.getSmtpPort(),
          secure: false,
          auth: {
            user: mailConfigService.getSmtpUser(),
            pass: mailConfigService.getSmtpPassword(),
          },
        },
        defaults: {
          from: `<no-reply@mail.com>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter({
            inlineCssEnabled: true,
          }),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],

  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
