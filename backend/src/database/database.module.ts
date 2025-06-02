import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule } from 'src/config/config.module';
import { DatabaseConfigService } from 'src/config/services';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [DatabaseConfigService],
      useFactory: (databaseConfigService: DatabaseConfigService) => ({
        type: databaseConfigService.getType() as any,
        host: databaseConfigService.getHost(),
        port: databaseConfigService.getPort(),
        username: databaseConfigService.getUsername(),
        password: databaseConfigService.getPassword(),
        database: databaseConfigService.getDatabase(),
        entities: [join(__dirname, '/entities/**/*.entity{.ts,.js}')],
        synchronize: databaseConfigService.getSynchronize(),
        logging: databaseConfigService.getLogging(),
      }),
    }),
  ],
})
export class DatabaseModule {}
