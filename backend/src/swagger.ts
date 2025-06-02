import {
  DevErrorResponseDto,
  DevSuccessResponseDto,
  ProdErrorResponseDto,
  ProdSuccessResponseDto,
} from '@common/dtos/responses';
import { AppConfigService } from '@config/services';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from '@shared/logger/logger.service';

const loggerService = LoggerService.createLogger('Swagger');

const swaggerConfig = new DocumentBuilder()
  .setTitle('NestJS API')
  .addBearerAuth()
  .build();

export const createSwaggerDocument = (
  app: NestExpressApplication,
  appConfigService: AppConfigService,
) => {
  const host = appConfigService.getAppHost();
  const port = appConfigService.getAppPort();
  const apiPrefix = appConfigService.getApiPrefix();
  const apiVersion = appConfigService.getApiVersion();
  const appSwaggerPath = appConfigService.getAppSwaggerPath();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [
      DevSuccessResponseDto,
      ProdSuccessResponseDto,
      DevErrorResponseDto,
      ProdErrorResponseDto,
    ],
  });

  SwaggerModule.setup(
    `${apiPrefix}/${apiVersion}/${appSwaggerPath}`,
    app,
    document,
  );

  loggerService.log(
    `Swagger documentation is available at ${host}:${port}/${apiPrefix}/${apiVersion}/docs`,
  );
};
