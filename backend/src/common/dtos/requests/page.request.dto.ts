import { EOrder } from '@common/constants/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PageRequestDto<T> {
  @ApiPropertyOptional({ enum: EOrder, default: EOrder.DESC })
  @Expose({ name: 'order' })
  @Transform(({ value }) => value || EOrder.DESC)
  @IsOptional()
  @IsEnum(EOrder)
  readonly order?: EOrder;

  @ApiPropertyOptional({
    name: 'order_by',
    default: 'createdAt',
  })
  @Expose({ name: 'order_by' })
  @Transform(({ value }) => value || 'createdAt')
  @IsOptional()
  @IsString()
  readonly orderBy?: keyof T;

  @ApiPropertyOptional({
    name: 'page',
    minimum: 1,
    default: 1,
  })
  @Expose({ name: 'page' })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsOptional()
  @Min(1, { message: 'Page must be at least 1' })
  @IsInt()
  readonly page?: number;

  @ApiPropertyOptional({
    name: 'take',
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Expose({ name: 'take' })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsOptional()
  @Max(50)
  @Min(1, { message: 'Take must be between 1 and 50' })
  @IsInt()
  @Type(() => Number)
  readonly take?: number;
}
