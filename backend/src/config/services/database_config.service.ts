import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDatabaseConfig } from 'src/common/interfaces/configs';

@Injectable()
export class DatabaseConfigService {
  constructor(private readonly configService: ConfigService) {}

  getType(): string {
    return this.configService.get<IDatabaseConfig>('database')!.dbType;
  }

  getHost(): string {
    return this.configService.get<IDatabaseConfig>('database')!.dbHost;
  }

  getPort(): number {
    return this.configService.get<IDatabaseConfig>('database')!.dbPort;
  }

  getUsername(): string {
    return this.configService.get<IDatabaseConfig>('database')!.dbUsername;
  }

  getPassword(): string {
    return this.configService.get<IDatabaseConfig>('database')!.dbPassword;
  }

  getDatabase(): string {
    return this.configService.get<IDatabaseConfig>('database')!.dbDatabase;
  }

  getSynchronize(): boolean {
    return this.configService.get<IDatabaseConfig>('database')!.dbSynchronize;
  }

  getLogging(): boolean {
    return this.configService.get<IDatabaseConfig>('database')!.dbLogging;
  }
}
