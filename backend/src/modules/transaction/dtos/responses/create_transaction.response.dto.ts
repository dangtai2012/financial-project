import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  CategoryTransactionResponseDto,
  WalletTransactionResponseDto,
} from './common.response.dto';

export class CreateTransactionResponseDto {
  @ApiProperty({ name: 'transaction_id' })
  @Expose({ name: 'id' })
  transaction_id: string;

  @ApiProperty({ name: 'wallet' })
  @Expose({ name: 'walletId' })
  @Type(() => WalletTransactionResponseDto)
  wallet: WalletTransactionResponseDto;

  @ApiProperty({ name: 'category' })
  @Expose({ name: 'categoryId' })
  @Type(() => CategoryTransactionResponseDto)
  category: CategoryTransactionResponseDto;

  @ApiProperty({ name: 'transaction_amount' })
  @Expose({ name: 'trxAmount' })
  @Type(() => Number)
  transaction_amount: number;

  @ApiProperty({ name: 'transaction_type' })
  @Expose({ name: 'trxType' })
  transaction_type: string;

  @ApiProperty({ name: 'transaction_date' })
  @Expose({ name: 'trxDate' })
  transaction_date: Date;

  @ApiProperty({ name: 'transaction_description' })
  @Expose({ name: 'trxDescription' })
  transaction_description: string | null;
}
