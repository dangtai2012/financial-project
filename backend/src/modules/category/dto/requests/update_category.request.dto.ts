import { ETypeCategory } from '@common/constants/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryRequestDto {
  @ApiProperty({ name: 'category_name', type: String })
  @Expose({ name: 'category_name' })
  @IsOptional()
  @IsString()
  catName?: string;

  @ApiPropertyOptional({
    name: 'category_type',
    type: String,
    enum: ETypeCategory,
    default: ETypeCategory.EXPENSE,
  })
  @Expose({ name: 'category_type' })
  @IsOptional()
  @IsEnum(ETypeCategory, {
    message: `Type must be one of the following: ${Object.values(ETypeCategory).join(', ')}`,
  })
  catType?: ETypeCategory;

  @ApiProperty({ name: 'parent_category_id', type: String })
  @Expose({ name: 'parent_category_id' })
  @IsOptional()
  @IsString()
  parentCategoryId?: string;
}
