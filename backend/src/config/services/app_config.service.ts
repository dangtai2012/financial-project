import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from 'src/common/interfaces/configs';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  getAppName(): string {
    return this.configService.get<IAppConfig>('app')!.appName;
  }

  getAppHost(): string {
    return this.configService.get<IAppConfig>('app')!.appHost;
  }

  getAppPort(): number {
    return this.configService.get<IAppConfig>('app')!.appPort;
  }

  getAppUrl(): string {
    return this.configService.get<IAppConfig>('app')!.appUrl;
  }

  getApiPrefix(): string {
    return this.configService.get<IAppConfig>('app')!.apiPrefix;
  }

  getApiVersion(): string {
    return this.configService.get<IAppConfig>('app')!.apiVersion;
  }

  getAppSwaggerEnable(): boolean {
    return this.configService.get<IAppConfig>('app')!.appSwaggerEnable;
  }

  getAppSwaggerPath(): string {
    return this.configService.get<IAppConfig>('app')!.appSwaggerPath;
  }
}
