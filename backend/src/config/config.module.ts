import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configurations } from './configurations';
import { configValidations } from './validations';
import { configServices } from './services';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      load: configurations,
      cache: true,
      validationSchema: configValidations,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
      expandVariables: true,
    }),
  ],

  providers: configServices,
  exports: configServices,
})
export class ConfigModule {}
