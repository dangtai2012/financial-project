import { GlobalExceptionFilter } from '@common/filters';
import { GlobalResponseInterceptor } from '@common/interceptors';
import {
  GlobalAuthGuard,
  JwtAuthGuard,
  PublicAuthGuard,
} from '@modules/auth/guards';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HttpRequestLoggingMiddleware } from './common/middlewares';
import { DatabaseModule } from './database/database.module';
import { modules } from './modules';
import { shareds } from './shared';

@Module({
  imports: [DatabaseModule, ...shareds, ...modules],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: GlobalExceptionFilter,
    },
    {
      provide: 'APP_GUARD',
      useClass: GlobalAuthGuard,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: GlobalResponseInterceptor,
    },

    PublicAuthGuard,
    JwtAuthGuard,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpRequestLoggingMiddleware).forRoutes('*');
  }
}
