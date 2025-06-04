import { COMMON_CONSTANTS } from '@common/constants';
import { EStatus } from '@common/constants/enums';
import {
  DevSuccessResponseDto,
  ProdSuccessResponseDto,
} from '@common/dtos/responses';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isProduction } from 'src/helpers';

@Injectable()
export class GlobalResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data: unknown) => {
        const message = this.reflector.get<string>(
          COMMON_CONSTANTS.RESPONSE_MESSAGE,
          context.getHandler(),
        );

        return isProduction()
          ? new ProdSuccessResponseDto(EStatus.SUCCESS, message, data)
          : new DevSuccessResponseDto(
              EStatus.SUCCESS,
              message,
              data,
              new Date().toISOString(),
              request.url,
              request.method,
            );
      }),
    );
  }
}
