import { registerAs } from '@nestjs/config';
import { IAppConfig } from 'src/common/interfaces/configs';

export const appConfig = registerAs(
  'app',
  (): IAppConfig => ({
    appName: process.env.APP_NAME!,
    appHost: process.env.APP_HOST!,
    appPort: parseInt(process.env.APP_PORT!, 10),
    appUrl: process.env.APP_URL!,
    apiPrefix: process.env.API_PREFIX!,
    apiVersion: process.env.API_VERSION!,
    appSwaggerEnable: process.env.APP_SWAGGER_ENABLE === 'true',
    appSwaggerPath: process.env.APP_SWAGGER_PATH!,
  }),
);
