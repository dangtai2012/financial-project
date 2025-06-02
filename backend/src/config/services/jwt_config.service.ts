import { IJwtConfig } from '@common/interfaces/configs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private readonly configService: ConfigService) {}

  getSecret(): string {
    return this.configService.get<IJwtConfig>('jwt')!.secret;
  }

  getAudience(): string | undefined {
    return this.configService.get<IJwtConfig>('jwt')!.audience;
  }

  getIssuer(): string | undefined {
    return this.configService.get<IJwtConfig>('jwt')!.issuer;
  }

  getAccessTokenTtl(): number {
    return this.configService.get<IJwtConfig>('jwt')!.accessTokenTtl;
  }

  getRefreshTokenTtl(): number {
    return this.configService.get<IJwtConfig>('jwt')!.refreshTokenTtl;
  }
}
