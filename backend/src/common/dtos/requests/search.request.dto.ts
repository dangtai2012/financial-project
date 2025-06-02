import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageRequestDto } from './page.request.dto';

export class SearchRequestDto extends PageRequestDto {
  @ApiPropertyOptional({
    description: 'Search keyword',
  })
  @IsOptional()
  @IsString()
  readonly search?: string;
}
