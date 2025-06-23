import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './relation_category.response.dto';

export class CreateCategoryResponseDto {
  @ApiProperty({ name: 'id' })
  @Expose({ name: 'id' })
  id: string;

  @ApiProperty({ name: 'parent_category_id' })
  @Expose({ name: 'parentCategoryId' })
  parent_category_id: string;

  @ApiProperty({ name: 'category_name' })
  @Expose({ name: 'catName' })
  category_name: string;

  @ApiProperty({ name: 'category_type' })
  @Expose({ name: 'catType' })
  category_type: string;

  @ApiProperty({ name: 'is_default' })
  @Expose({ name: 'isDefault' })
  is_default: boolean;

  @ApiProperty({ name: 'user' })
  @Expose({ name: 'userId' })
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
