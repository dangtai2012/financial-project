import { winstonConfig } from '@config/configurations';
import {
  Inject,
  Injectable,
  LoggerService as NestLoggerService,
  Optional,
  Scope,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import * as winston from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private context?: string;

  constructor(
    /**
     * : Providers
     */

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private winstonLogger: WinstonLogger,
    /*end*/
  ) {}

  setContext(context: string) {
    this.context = context;
    return this;
  }

  static createLogger(context: string): LoggerService {
    const loggerService = new LoggerService(
      new WinstonLogger(winston.createLogger(winstonConfig)),
    ).setContext(context);

    return loggerService;
  }

  log(message: string, metadata?: Record<string, any>): void {
    this.winstonLogger
      .getWinstonLogger()
      .info(message, { context: this.context, ...metadata });
  }

  error(message: string, trace?: any, metadata?: Record<string, any>): void {
    this.winstonLogger
      .getWinstonLogger()
      .error(message, { trace, context: this.context, ...metadata });
  }

  warn(message: string, metadata?: Record<string, any>): void {
    this.winstonLogger
      .getWinstonLogger()
      .warn(message, { context: this.context, ...metadata });
  }

  debug(message: string, metadata?: Record<string, any>): void {
    this.winstonLogger
      .getWinstonLogger()
      .debug(message, { context: this.context, ...metadata });
  }

  verbose(message: string, metadata?: Record<string, any>): void {
    this.winstonLogger
      .getWinstonLogger()
      .verbose(message, { context: this.context, ...metadata });
  }

  // withMetadata(metadata: Record<string, any>) {
  //   return {
  //     log: (message: string) => this.log(message, this.context, metadata),
  //     error: (message: string, trace?: any) =>
  //       this.error(message, trace, this.context, metadata),
  //     warn: (message: string) => this.warn(message, this.context, metadata),
  //     debug: (message: string) => this.debug(message, this.context, metadata),
  //     verbose: (message: string) =>
  //       this.verbose(message, this.context, metadata),
  //   };
  // }
}
