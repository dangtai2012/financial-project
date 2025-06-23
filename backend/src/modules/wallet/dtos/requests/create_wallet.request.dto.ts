import { ETypeWallet } from '@common/constants/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateWalletRequestDto {
  @ApiProperty({ name: 'wallet_name', type: String, example: 'Cash' })
  @Expose({ name: 'wallet_name' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  wltName: string;

  @ApiProperty({ name: 'currency_id', type: String, example: 'VND' })
  @Expose({ name: 'currency_id' })
  @IsString()
  @IsNotEmpty()
  currencyId: string;

  @ApiProperty({ name: 'wallet_balance', type: Number, example: 100_000 })
  @Expose({ name: 'wallet_balance' })
  @Min(0, { message: 'Wallet balance must be a non-negative number' })
  @IsNumber()
  @IsNotEmpty()
  wltBalance: number;

  @ApiPropertyOptional({
    name: 'wallet_type',
    enum: ETypeWallet,
    default: ETypeWallet.CASH,
  })
  @Expose({ name: 'wallet_type' })
  @IsEnum(ETypeWallet, {
    message: `Type must be one of the following: ${Object.values(ETypeWallet).join(', ')}`,
  })
  @IsNotEmpty()
  wltType: ETypeWallet;
}
