import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from '../paginations';

export class PageResponseDto<T> {
  @ApiProperty({ name: 'data_paginated', isArray: true })
  @IsArray()
  readonly data_paginated: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(dataPaginated: T[], meta: PageMetaDto) {
    this.data_paginated = dataPaginated;
    this.meta = meta;
  }
}
