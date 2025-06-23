import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTransactionRequestDto {
  @ApiProperty({
    name: 'wallet_id',
    type: String,
  })
  @Expose({ name: 'wallet_id' })
  @IsString()
  @IsNotEmpty()
  walletId: string;

  @ApiProperty({
    name: 'category_id',
    type: String,
  })
  @Expose({ name: 'category_id' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ name: 'transaction_amount', type: Number, example: 100.5 })
  @Expose({ name: 'transaction_amount' })
  @IsNumber()
  @IsNotEmpty()
  trxAmount: number;

  // @ApiProperty({
  //   name: 'transaction_type',
  //   enum: ETransactionType,
  //   default: ETransactionType.EXPENSE,
  // })
  // @Expose({ name: 'transaction_type' })
  // @IsEnum(ETransactionType, {
  //   message: `Type must be one of the following: ${Object.values(ETransactionType).join(', ')}`,
  // })
  // @IsOptional()
  // trxType?: ETransactionType;

  @ApiProperty({ name: 'transaction_date', type: Date, example: '2023-01-01' })
  @Expose({ name: 'transaction_date' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  trxDate: Date;

  @ApiPropertyOptional({
    name: 'transaction_description',
    type: String,
    example: 'Grocery shopping',
  })
  @Expose({ name: 'transaction_description' })
  @MaxLength(255, { message: 'Description must be less than 255 characters' })
  @IsString()
  @IsOptional()
  trxDescription?: string;
}
