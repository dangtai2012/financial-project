import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageRequestDto } from './page.request.dto';
import { Expose } from 'class-transformer';

export class SearchRequestDto<T> extends PageRequestDto<T> {
  @ApiPropertyOptional({
    name: 'search',
    description: 'Search keyword',
  })
  @Expose({ name: 'search' })
  @IsOptional()
  @IsString()
  readonly search?: string;
}
