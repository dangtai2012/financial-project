import { EEnvironment } from '@common/constants/enums';

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === EEnvironment.DEVELOPMENT;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === EEnvironment.PRODUCTION;
}
