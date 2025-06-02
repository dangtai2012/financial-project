import { IJwtConfig } from '@common/interfaces/configs';
import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs(
  'jwt',
  (): IJwtConfig => ({
    secret: process.env.JWT_SECRET!,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL!, 10), // 1 hour
    refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL!, 10), // 24 hours
  }),
);
