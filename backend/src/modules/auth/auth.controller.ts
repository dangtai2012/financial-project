import { COMMON_CONSTANTS } from '@common/constants';
import { EAuth } from '@common/constants/enums';
import { Auth, ResponseMessage, Serialize } from '@common/decorators';
import { ApiErrorResponse, ApiSuccessResponse } from '@common/dtos/responses';
import { UserEntity } from '@database/entities';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import {
  ChangePasswordRequestDto,
  ForgotPasswordRequestDto,
  LoginRequestDto,
  RefreshTokenRequestDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
} from './dtos/requests';
import {
  LoginResponseDto,
  RefreshTokenResponseDto,
  RegisterResponseDto,
} from './dtos/responses';

@Auth(EAuth.IS_PUBLIC)
@Controller('auth')
export class AuthController {
  constructor(
    /**
     * : Services
     */
    private readonly authService: AuthService,
    /*end*/
  ) {}

  //#region register
  /**
   * : Register
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(RegisterResponseDto)
  @Serialize(RegisterResponseDto)
  @ResponseMessage('Register successful')
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registerRequestDto: RegisterRequestDto) {
    return this.authService.register(registerRequestDto);
  }
  //#endregion

  // #region login
  /**
   * : Login
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(LoginResponseDto)
  @Serialize(LoginResponseDto)
  @ResponseMessage('Login successful')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request, @Body() loginRequestDto: LoginRequestDto) {
    return await this.authService.login(
      req[COMMON_CONSTANTS.CURRENT_USER] as UserEntity,
    );
  }
  // #endregion

  //#region refreshToken
  /**
   * : Refresh Token
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(RefreshTokenResponseDto)
  @Serialize(RefreshTokenResponseDto)
  @ResponseMessage('Refresh token successful')
  @HttpCode(HttpStatus.OK)
  @Post('refresh_token')
  async refreshToken(@Body() refreshTokenRequestDto: RefreshTokenRequestDto) {
    return await this.authService.refreshToken(refreshTokenRequestDto);
  }
  //#endregion

  //#region logout
  /**
   * : Logout
   */

  @ApiErrorResponse()
  @ApiSuccessResponse(Object)
  @ResponseMessage('Logout successful')
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Body() refreshTokenRequestDto: RefreshTokenRequestDto,
  ) {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    await this.authService.logout(
      accessToken as string,
      refreshTokenRequestDto,
    );
  }
  //#endregion

  //#region verify-email
  /**
   * : Verify Email
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(Object)
  @ResponseMessage('Email verified successfully')
  @HttpCode(HttpStatus.OK)
  @Get('verify_email/:token')
  async verifyEmail(@Param('token') token: string) {
    await this.authService.verifyEmail(token);
  }
  //#endregion

  // #region forgotPassword
  /**
   * : Forgot Password
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(Object)
  @ResponseMessage('Reset password email sent successfully')
  @HttpCode(HttpStatus.OK)
  @Get('forgot_password')
  async forgotPassword(
    @Body() forgotPasswordRequestDto: ForgotPasswordRequestDto,
  ) {
    return await this.authService.forgotPassword(forgotPasswordRequestDto);
  }
  // #endregion

  // #region resetPassword
  /**
   * : Reset Password
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(Object)
  @ResponseMessage('Password reset successfully')
  @HttpCode(HttpStatus.OK)
  @Post('reset_password')
  async resetPassword(
    @Query() query: Record<string, string>,
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    return await this.authService.resetPassword(query, resetPasswordRequestDto);
  }
  // #endregion

  // #region changePassword
  /**
   * : Change Password
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(Object)
  @ResponseMessage('Password changed successfully')
  @HttpCode(HttpStatus.OK)
  @Auth(EAuth.IS_PRIVATE)
  @Post('change_password')
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordRequestDto: ChangePasswordRequestDto,
  ) {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    await this.authService.changePassword(
      accessToken as string,
      changePasswordRequestDto,
    );

    return {};
  }
  // #endregion
}
