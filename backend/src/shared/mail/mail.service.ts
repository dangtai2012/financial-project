import { AppConfigService, MailConfigService } from '@config/services';
import { UserEntity } from '@database/entities';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly defaultLink: string;

  constructor(
    /**
     * : Config
     */
    private readonly appConfigService: AppConfigService,
    private readonly mailerConfigService: MailConfigService,
    /*end*/

    /**
     * : Services
     */
    private readonly mailerService: MailerService,
    /*end*/
  ) {
    this.defaultLink = `${this.appConfigService.getAppUrl()}/${this.appConfigService.getApiPrefix()}/${this.appConfigService.getApiVersion()}`;
  }

  //#region sendMailWelcomeAndVerify
  /**
   * : Send welcome and verify email
   */

  async sendMailWelcomeAndVerify(user: UserEntity, token: string) {
    const verificationLink = `${this.defaultLink}/auth/verify_email/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: `Welcome to ${this.appConfigService.getAppName()}`,
      template: './welcome_and_verify',
      context: {
        app_name: this.appConfigService.getAppName(),
        username: user.name,
        verification_link: verificationLink,
        expired_in: this.mailerConfigService.getMailVerifyExpiration(),
      },
    });
  }
  //#endregion

  // #region sendMailForgotPassword
  /**
   * : Send forgot password email
   */
  async sendMailForgotPassword(user: UserEntity, token: string) {
    const resetLink = `${this.defaultLink}/auth/reset_password?token=${token}&email=${user.email}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: `Reset your password`,
      template: './reset_password',
      context: {
        app_name: this.appConfigService.getAppName(),
        username: user.name,
        reset_link: resetLink,
        expired_in: this.mailerConfigService.getMailVerifyExpiration(),
      },
    });
  }
  // #endregion
}
