import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService } from '@shared/logger/logger.service';
import { AppModule } from './app.module';
import { validationExceptionFactory } from './common/exceptions/factories';
import { AppConfigService } from './config/services';
import { createSwaggerDocument } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  //#region INJECT
  const appConfigService = app.get(AppConfigService);
  const loggerService = (await app.resolve(LoggerService)).setContext(
    bootstrap.name,
  );
  //#endregion

  const host = appConfigService.getAppHost();
  const port = appConfigService.getAppPort();
  const apiPrefix = appConfigService.getApiPrefix();
  const apiVersion = appConfigService.getApiVersion();
  const appSwaggerEnable = appConfigService.getAppSwaggerEnable();

  //#region CONFIG

  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );

  if (appSwaggerEnable) {
    createSwaggerDocument(app, appConfigService);
  }
  //#endregion

  await app.listen(port, host, () => {
    loggerService.log(`Server is running on ${host}:${port}`);
  });

  // await app.listen(3000);
}
bootstrap();
