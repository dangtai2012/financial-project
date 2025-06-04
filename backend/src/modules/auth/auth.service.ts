import { REDIS } from '@common/constants';
import { JwtConfigService, MailConfigService } from '@config/services';
import { UserEntity } from '@database/entities';
import { uuid } from '@helpers/index';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '@shared/cache/cache.service';
import { LoggerService } from '@shared/logger/logger.service';
import { MailService } from '@shared/mail/mail.service';
import {
  ChangePasswordRequestDto,
  ForgotPasswordRequestDto,
  RefreshTokenRequestDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
} from './dtos/requests';
import { HashingProvider } from './providers/abstracts';
import { UserRepository } from '@modules/user/user.repository';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    /**
     * : Logger
     */
    private readonly logger: LoggerService,
    /*end*/

    /**
     * : Configs
     */

    private readonly jwtConfigService: JwtConfigService,
    private readonly mailConfigService: MailConfigService,
    /*end*/

    /**
     * : Repositories
     */
    private readonly userRepo: UserRepository,
    /*end*/

    /**
     * : Providers
     */

    private readonly hashingProvider: HashingProvider,
    /*end*/

    /**
     * : Services
     */
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
    private readonly mailService: MailService,

    /*end*/
  ) {
    this.logger.setContext(AuthService.name);
  }

  //#region validateEmailAndPassword
  /**
   * : Validate Email and Password
   */
  async validateEmailAndPassword(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordValid = await this.hashingProvider.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }
  //#endregion

  //#region register
  /**
   * : Register
   */

  async register(registerRequestDto: RegisterRequestDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: registerRequestDto.email },
    });

    const verificationToken = await this.jwtService.signAsync(
      { email: registerRequestDto.email },
      { expiresIn: this.mailConfigService.getMailVerifyExpiration() },
    );

    if (existingUser) {
      if (existingUser.isVerified) {
        throw new ConflictException('Email already exists');
      }

      await this.mailService.sendMailWelcomeAndVerify(
        existingUser,
        verificationToken,
      );

      return {};
    }

    const hashedPassword = await this.hashingProvider.hashPassword(
      registerRequestDto.password,
    );

    const createUser = this.userRepo.create({
      name: registerRequestDto.name,
      email: registerRequestDto.email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepo.save(createUser);

    await this.mailService.sendMailWelcomeAndVerify(
      savedUser,
      verificationToken,
    );

    return {};
  }
  //#endregion

  // #region login
  /**
   * : Login
   */
  async login(userEntity: UserEntity) {
    return await this.generateTokens(userEntity);
  }
  // #endregion

  //#region refreshToken
  /**
   * : Refresh Token
   */
  async refreshToken(refreshTokenRequestDto: RefreshTokenRequestDto) {
    const { sub, jti, iat } = await this.jwtService
      .verifyAsync(refreshTokenRequestDto.refreshToken)
      .catch(() => {
        throw new UnauthorizedException(
          'Invalid or expired refresh token payload (sv)',
        );
      });

    const user = await this.userRepo.findOne({
      where: { id: sub },
      select: ['id', 'passwordChangedAt'],
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid or expired refresh token user (sv)',
      );
    }

    if (
      user.passwordChangedAt &&
      user.passwordChangedAt.getTime() > iat! * 1000
    ) {
      await this.cacheService.del(`${REDIS.WHITELIST}:refresh_token:${jti}`);

      throw new UnauthorizedException(
        'Password has been changed, please login again! (sv)',
      );
    }

    const cachedUserId = await this.cacheService.get(
      `${REDIS.WHITELIST}:refresh_token:${jti}`,
    );

    if (!cachedUserId || cachedUserId !== sub) {
      throw new UnauthorizedException('Invalid or expired refresh token (sv)');
    }

    await this.cacheService.del(`${REDIS.WHITELIST}:refresh_token:${jti}`);

    return await this.generateTokens(user);
  }
  //#endregion

  //#region logout
  /**
   * : Logout
   */

  async logout(
    accessToken: string,
    refreshTokenRequestDto: RefreshTokenRequestDto,
  ) {
    if (!accessToken) {
      throw new BadRequestException('Invalid token');
    }

    const { jti: accessTokenJti, exp } =
      await this.jwtService.decode(accessToken);

    const accessTokenExpiresIn = exp - Math.floor(Date.now() / 1000);
    if (accessTokenExpiresIn > 0) {
      await this.cacheService.set(
        `${REDIS.BLACKLIST}:access_token:${accessTokenJti}`,
        accessTokenJti as string,
        accessTokenExpiresIn,
      );
    }

    const { jti: refreshTokenJti } = await this.jwtService.decode(
      refreshTokenRequestDto.refreshToken,
    );
    await this.cacheService.del(
      `${REDIS.WHITELIST}:refresh_token:${refreshTokenJti}`,
    );

    return {};
  }
  //#endregion

  // #region verifyEmail
  /**
   * : Verify Email
   */
  async verifyEmail(token: string): Promise<UserEntity> {
    const payload = await this.jwtService.verifyAsync(token).catch(() => {
      throw new UnauthorizedException(
        'Invalid or expired verification token (sv)',
      );
    });

    const user = await this.userRepo.findOne({
      where: { email: payload.email },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid or expired verification token (sv)',
      );
    }

    if (user.isVerified) {
      throw new ConflictException('Account already verified (sv)');
    }

    user.isVerified = true;
    await this.userRepo.save(user);

    return user;
  }
  // #endregion

  // #region forgotPassword
  /**
   * : Forgot Password
   */
  async forgotPassword(forgotPasswordRequestDto: ForgotPasswordRequestDto) {
    const { email } = forgotPasswordRequestDto;

    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const passwordResetToken = crypto.randomBytes(16).toString('hex');

    await this.mailService.sendMailForgotPassword(user, passwordResetToken);

    const hashPasswordResetToken =
      await this.hashingProvider.hashPassword(passwordResetToken);

    const passwordResetTokenExpiresAt = new Date(
      Date.now() + this.mailConfigService.getPasswordResetExpiration(),
    );

    user.passwordResetToken = hashPasswordResetToken;
    user.passwordResetTokenExpiresAt = passwordResetTokenExpiresAt;

    await this.userRepo.save(user);

    return {};
  }
  // #endregion

  // #region resetPassword
  /**
   * : Reset Password
   */
  async resetPassword(
    query: Record<string, string>,
    resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    const { token, email } = query;

    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid reset token');
    }

    if (
      resetPasswordRequestDto.newPassword !==
      resetPasswordRequestDto.confirmNewPassword
    ) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    const isResetTokenValid = await this.hashingProvider.comparePassword(
      token,
      user.passwordResetToken,
    );

    if (!isResetTokenValid) {
      throw new UnauthorizedException('Invalid reset token');
    }

    const passwordResetTokenExpiresAt = user.passwordResetTokenExpiresAt;

    if (
      passwordResetTokenExpiresAt &&
      passwordResetTokenExpiresAt.getTime() < Date.now()
    ) {
      throw new UnauthorizedException('Reset token has expired');
    }

    user.passwordResetToken = null as any;
    user.passwordResetTokenExpiresAt = null as any;
    user.password = await this.hashingProvider.hashPassword(
      resetPasswordRequestDto.newPassword,
    );

    const passwordChangedAt = Math.floor(Date.now() / 1000);
    user.passwordChangedAt = new Date(passwordChangedAt * 1000);

    await this.userRepo.save(user);

    return {};
  }
  // #endregion

  // #region changePassword
  /**
   * : Change Password
   */
  async changePassword(
    accessToken: string,
    changePasswordRequestDto: ChangePasswordRequestDto,
  ) {
    if (!accessToken) {
      throw new BadRequestException('Invalid token');
    }

    const {
      sub,
      jti: accessTokenJti,
      exp: accessTokenExp,
    } = this.jwtService.decode(accessToken);

    const user = await this.userRepo.findOne({
      where: { id: sub },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    const isOldPasswordValid = await this.hashingProvider.comparePassword(
      changePasswordRequestDto.oldPassword,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    if (
      changePasswordRequestDto.newPassword !==
      changePasswordRequestDto.confirmNewPassword
    ) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    user.password = await this.hashingProvider.hashPassword(
      changePasswordRequestDto.newPassword,
    );

    const changePasswordDate = Math.floor(Date.now() / 1000);
    user.passwordChangedAt = new Date(changePasswordDate * 1000);

    await this.userRepo.save(user);

    const accessTokenExpiresIn = accessTokenExp - Math.floor(Date.now() / 1000);
    if (accessTokenExpiresIn > 0) {
      await this.cacheService.set(
        `${REDIS.BLACKLIST}:access_token:${accessTokenJti}`,
        accessTokenJti as string,
        accessTokenExpiresIn,
      );
    }

    const { jti: refreshTokenJti } = await this.jwtService.decode(
      changePasswordRequestDto.refreshToken,
    );
    await this.cacheService.del(
      `${REDIS.WHITELIST}:refresh_token:${refreshTokenJti}`,
    );
  }
  // #endregion

  // #region generateTokens
  /**
   * : Generate Access Token and Refresh Token
   */
  private async generateTokens(user: UserEntity) {
    const accessTokenJti = uuid();
    const refreshTokenJti = uuid();

    const accessTokenExpiresIn = this.jwtConfigService.getAccessTokenTtl();
    const refreshTokenExpiresIn = this.jwtConfigService.getRefreshTokenTtl();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          jti: accessTokenJti,
          email: user.email,
        },
        {
          expiresIn: accessTokenExpiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          jti: refreshTokenJti,
        },
        {
          expiresIn: refreshTokenExpiresIn,
        },
      ),
    ]);

    await this.cacheService.set(
      `${REDIS.WHITELIST}:refresh_token:${refreshTokenJti}`,
      user.id,
      refreshTokenExpiresIn,
    );

    return { accessToken, refreshToken };
  }
  // #endregion
}
