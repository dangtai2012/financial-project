import { Global, Module } from '@nestjs/common';
import { IdGeneratorService } from './id_generator.service';

@Global()
@Module({
  providers: [IdGeneratorService],
  exports: [IdGeneratorService],
})
export class IdGeneratorModule {}
