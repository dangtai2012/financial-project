import { winstonConfig } from '@config/configurations';
import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
