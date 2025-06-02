import { GlobalExceptionFilter } from '@common/filters';
import { GlobalResponseInterceptor } from '@common/interceptors';
import { JwtAuthGuard } from '@modules/auth/guards';
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
      useClass: JwtAuthGuard,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: GlobalResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpRequestLoggingMiddleware).forRoutes('*');
  }
}
