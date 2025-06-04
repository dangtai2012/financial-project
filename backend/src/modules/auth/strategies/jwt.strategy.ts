import { REDIS } from '@common/constants';
import { IJwtPayload } from '@common/interfaces/auth';
import { JwtConfigService } from '@config/services';
import { UserRepository } from '@modules/user/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { CacheService } from '@shared/cache/cache.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    /**
     * : Configs
     */
    private readonly jwtConfigService: JwtConfigService,
    /*end*/

    /**
     * : Repositories
     */
    private readonly userRepo: UserRepository,

    /*end*/

    /**
     * : Services
     */
    private readonly cacheService: CacheService,
    /*end*/
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfigService.getSecret(),
      audience: jwtConfigService.getAudience(),
      issuer: jwtConfigService.getIssuer(),
    });
  }

  async validate(payload: IJwtPayload) {
    const { sub, jti: accessTokenJti, iat: accessTokenIat } = payload;

    // Check verify account
    const user = await this.userRepo.findOne({
      where: { id: sub },
      select: ['id', 'isVerified', 'passwordChangedAt'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token (st)');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Account is not verified (st)');
    }

    // Check blacklist access token
    const isBlacklisted = await this.cacheService.get(
      `${REDIS.BLACKLIST}:access_token:${accessTokenJti}`,
    );

    if (isBlacklisted) {
      throw new UnauthorizedException('Invalid token (st)');
    }

    // Check password changed time
    if (
      user.passwordChangedAt &&
      user.passwordChangedAt.getTime() > accessTokenIat! * 1000
    ) {
      throw new UnauthorizedException(
        'Password has been changed, please login again! (st)',
      );
    }

    return payload;
  }
}
