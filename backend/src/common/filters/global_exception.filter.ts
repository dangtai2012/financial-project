import { EStatus } from '@common/constants/enums';
import {
  DevErrorResponseDto,
  ProdErrorResponseDto,
} from '@common/dtos/responses';
import { isProduction } from '@helpers/index';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpServer,
  HttpStatus,
} from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { MESSAGES } from '@nestjs/core/constants';
import { LoggerService } from '@shared/logger/logger.service';

@Catch()
export class GlobalExceptionFilter<T = any> implements ExceptionFilter<T> {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(GlobalExceptionFilter.name);
  }

  catch(exception: T, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    if (!(exception instanceof HttpException)) {
      return this.handleUnknownError(exception, host, httpAdapter);
    }

    const request = host.getArgByIndex(0);
    const response = host.getArgByIndex(1);

    const errorResponse = exception.getResponse();

    const statusCode: number =
      errorResponse['statusCode'] || exception.getStatus();
    const message: string = errorResponse['message'] || exception.message;
    const errors: string[] = Array.isArray(errorResponse['error'])
      ? errorResponse['error']
      : [errorResponse['message'] || errorResponse['error']];
    const typeError: string = exception.name || 'HttpError';

    this.loggerService.error(message, exception.stack);

    const responseBody = isProduction()
      ? new ProdErrorResponseDto(
          EStatus.FAIL,
          message,
          errors,
          statusCode,
          typeError,
        )
      : new DevErrorResponseDto(
          EStatus.FAIL,
          message,
          errors,
          statusCode,
          typeError,
          new Date().toISOString(),
          request.url,
          request.method,
        );

    if (!httpAdapter.isHeadersSent(response)) {
      httpAdapter.reply(response, responseBody, statusCode);
    } else {
      httpAdapter.end(response);
    }
  }

  public handleUnknownError(
    exception: T,
    host: ArgumentsHost,
    httpAdapter: AbstractHttpAdapter | HttpServer,
  ) {
    const request = host.getArgByIndex(0);
    const response = host.getArgByIndex(1);

    let statusCode: number;
    let message: string;
    let errors: string[];
    let typeError: string;

    console.log(exception);

    if (this.isHttpError(exception)) {
      statusCode = exception['statusCode'];
      message = exception.message;
      errors = [exception.message];
      typeError = exception['name'];
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = MESSAGES.UNKNOWN_EXCEPTION_MESSAGE;
      errors = [message];
      typeError = 'InternalServerError';
    }

    const responseBody = isProduction()
      ? new ProdErrorResponseDto(
          EStatus.ERROR,
          message,
          errors,
          statusCode,
          typeError,
        )
      : new DevErrorResponseDto(
          EStatus.ERROR,
          message,
          errors,
          statusCode,
          typeError,
          new Date().toISOString(),
          request.url,
          request.method,
        );

    if (!httpAdapter.isHeadersSent(response)) {
      httpAdapter.reply(response, responseBody, statusCode);
    } else {
      httpAdapter.end(response);
    }

    return this.loggerService.error(
      this.isError(exception)
        ? exception.message
        : (exception['message'] as string),
      this.isError(exception) ? exception.stack : exception,
    );
  }

  /**
   * Checks if the err is Error.
   * @param err error object
   */
  public isError(err: any): err is Error {
    return isObject(err) && !!(err as Error).message;
  }

  /**
   * Checks if the thrown error comes from the "http-errors" library.
   * @param err error object
   */
  public isHttpError(err: any): err is { statusCode: number; message: string } {
    return err?.statusCode && err?.message;
  }
}
