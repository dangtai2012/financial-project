import { EOrder } from '@common/constants/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class PageRequestDto {
  @ApiPropertyOptional({ enum: EOrder, default: EOrder.ASC })
  @IsOptional()
  @IsEnum(EOrder)
  readonly order?: EOrder = EOrder.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Min(1)
  @IsInt()
  @Type(() => Number)
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @IsOptional()
  @Max(50)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  readonly take?: number = 10;

  get skip(): number {
    return ((this.page || 1) - 1) * (this.take || 10);
  }
}
