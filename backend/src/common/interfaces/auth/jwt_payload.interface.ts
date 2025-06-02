export interface IJwtPayload {
  sub: string;
  email: string;
  jti: string;
  iat?: number;
  exp?: number;
  aud?: string;
  iss?: string;
}
