import { COMMON_CONSTANTS } from '@common/constants';
import { EAuth } from '@common/constants/enums';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt_auth.guard';
import { PublicAuthGuard } from './public_auth.guard';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  private static readonly defaultAuth = EAuth.IS_PRIVATE;
  private readonly authGuardMap: Record<EAuth, CanActivate>;

  constructor(
    private readonly reflector: Reflector,
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly publicAuthGuard: PublicAuthGuard,
  ) {
    this.authGuardMap = {
      [EAuth.IS_PRIVATE]: this.jwtAuthGuard,
      [EAuth.IS_PUBLIC]: this.publicAuthGuard,
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authType = this.reflector.getAllAndOverride<EAuth>(
      COMMON_CONSTANTS.AUTH_TYPE,
      [context.getHandler(), context.getClass()],
    ) ?? [GlobalAuthGuard.defaultAuth];

    return (await this.authGuardMap[authType].canActivate(context)) as boolean;
  }
}
