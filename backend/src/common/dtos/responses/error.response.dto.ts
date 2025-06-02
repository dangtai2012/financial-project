import { EStatus } from '@common/constants/enums';
import { IDevResponse, IErrorResponse } from '@common/interfaces/responses';
import { isProduction } from '@helpers/index';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export class DevErrorResponseDto implements IDevResponse, IErrorResponse {
  @ApiProperty({
    example: EStatus.ERROR,
  })
  public readonly status: string;

  @ApiProperty({ name: 'message' })
  public readonly message: string;

  public readonly errors: string[];

  @ApiProperty({ name: 'status_code' })
  public readonly status_code: number;

  @ApiProperty({ name: 'type_error' })
  public readonly type_error: string;

  @ApiProperty({ name: 'timestamp' })
  public readonly timestamp: string;

  @ApiProperty({ name: 'path' })
  public readonly path: string;

  @ApiProperty({ name: 'method' })
  public readonly method: string;

  constructor(
    status: string,
    message: string,
    errors: string[],
    statusCode: number,
    typeError: string,
    timestamp: string,
    path: string,
    method: string,
  ) {
    this.status = status;
    this.message = message;
    this.errors = errors;
    this.status_code = statusCode;
    this.type_error = typeError;
    this.timestamp = timestamp;
    this.path = path;
    this.method = method;
  }
}

export class ProdErrorResponseDto implements IErrorResponse {
  @ApiProperty({
    example: EStatus.ERROR,
  })
  public readonly status: string;

  @ApiProperty({ name: 'message' })
  public readonly message: string;

  public readonly errors: string[];

  @ApiProperty({ name: 'status_code' })
  public readonly status_code: number;

  @ApiProperty({ name: 'type_error' })
  public readonly type_error: string;

  constructor(
    status: string,
    message: string,
    errors: string[],
    statusCode: number,
    typeError: string,
  ) {
    this.status = status;
    this.message = message;
    this.errors = errors;
    this.status_code = statusCode;
    this.type_error = typeError;
  }
}

export const ApiErrorResponse = (errors?: string[]) => {
  const errorResponseType = isProduction()
    ? ProdErrorResponseDto
    : DevErrorResponseDto;

  return applyDecorators(
    ApiResponse({
      status: 400,
      schema: {
        allOf: [
          { $ref: getSchemaPath(errorResponseType) },
          {
            properties: {
              errors: {
                type: 'array',
                items: {
                  type: 'string',
                },
                example: errors || ['string', 'string'],
              },
            },
          },
        ],
      },
    }),
  );
};
