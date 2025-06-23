import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateTransactionRequestDto {
  @ApiPropertyOptional({ name: 'category_id', type: String })
  @Expose({ name: 'category_id' })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ name: 'transaction_amount', type: Number })
  @Expose({ name: 'transaction_amount' })
  @IsNumber()
  @IsOptional()
  trxAmount: number;

  @ApiPropertyOptional({ name: 'transaction_date', type: Date })
  @Expose({ name: 'transaction_date' })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate({
    message: 'transaction_date must be a valid date',
  })
  @IsOptional()
  trxDate: Date;

  @ApiPropertyOptional({ name: 'transaction_description', type: String })
  @Expose({ name: 'transaction_description' })
  @MaxLength(255, { message: 'Description must be less than 255 characters' })
  @IsString()
  @IsOptional()
  trxDescription?: string;
}
