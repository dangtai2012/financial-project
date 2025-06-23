import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class WalletTransactionResponseDto {
  @ApiProperty({ name: 'id' })
  @Expose({ name: 'id' })
  wallet_id: string;

  @ApiProperty({ name: 'wallet_name' })
  @Expose({ name: 'wltName' })
  wallet_name: string;
}

export class CategoryTransactionResponseDto {
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
}
