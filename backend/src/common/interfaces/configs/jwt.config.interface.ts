export interface IJwtConfig {
  secret: string;
  audience?: string;
  issuer?: string;
  accessTokenTtl: number;
  refreshTokenTtl: number;
}
