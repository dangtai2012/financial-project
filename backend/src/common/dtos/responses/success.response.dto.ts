import { EStatus } from '@common/constants/enums';
import { IDevResponse, ISuccessResponse } from '@common/interfaces/responses';
import { isProduction } from '@helpers/index';
import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { PageMetaDto } from '../paginations';
import { PageResponseDto } from './page.response.dto';

export class DevSuccessResponseDto<T>
  implements ISuccessResponse<T>, IDevResponse
{
  @ApiProperty({ name: 'status', example: EStatus.SUCCESS })
  public readonly status: string;

  @ApiProperty({ name: 'message' })
  public readonly message: string;

  // @ApiProperty() // For generic data, schema will be defined in ApiOkResponse
  public readonly data: T;

  @ApiProperty({ name: 'timestamp' })
  public readonly timestamp: string;

  @ApiProperty({ name: 'path' })
  public readonly path: string;

  @ApiProperty({ name: 'method' })
  public readonly method: string;

  constructor(
    status: string,
    message: string,
    data: T,
    timestamp: string,
    path: string,
    method: string,
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.timestamp = timestamp;
    this.path = path;
    this.method = method;
  }
}

export class ProdSuccessResponseDto<T> implements ISuccessResponse<T> {
  @ApiProperty({ name: 'status', example: EStatus.SUCCESS })
  public readonly status: string;

  @ApiProperty({ name: 'message' })
  public readonly message: string;

  // @ApiProperty() // For generic data, schema will be defined in ApiOkResponse
  public readonly data: T;

  constructor(status: string, message: string, data: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export const ApiSuccessResponse = (schema: Type<unknown>) => {
  const successResponseType = isProduction()
    ? ProdSuccessResponseDto
    : DevSuccessResponseDto;

  return applyDecorators(
    ApiExtraModels(schema),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(successResponseType) },
          {
            properties: {
              data: { $ref: getSchemaPath(schema) },
            },
          },
        ],
      },
    }),
  );
};

export const ApiPaginatedSuccessResponse = (schema: Type<unknown>) => {
  const successResponseType = isProduction()
    ? ProdSuccessResponseDto
    : DevSuccessResponseDto;

  return applyDecorators(
    ApiExtraModels(schema, PageMetaDto, PageResponseDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(successResponseType) },
          {
            properties: {
              status: { example: EStatus.SUCCESS },
              data: {
                $ref: getSchemaPath(PageResponseDto),
                properties: {
                  data_paginated: {
                    type: 'array',
                    items: { $ref: getSchemaPath(schema) },
                  },
                  meta: {
                    $ref: getSchemaPath(PageMetaDto),
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
