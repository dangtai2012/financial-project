import { ETypeCategory } from '@common/constants/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryRequestDto {
  @ApiProperty({ name: 'category_name', type: String, example: 'Hang out' })
  @Expose({ name: 'category_name' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  catName: string;

  @ApiPropertyOptional({
    name: 'category_type',
    enum: ETypeCategory,
    default: ETypeCategory.EXPENSE,
  })
  @Expose({ name: 'category_type' })
  @IsEnum(ETypeCategory, {
    message: `Category type must be one of the following: ${Object.values(ETypeCategory).join(', ')}`,
  })
  @IsNotEmpty()
  catType: ETypeCategory;
}
