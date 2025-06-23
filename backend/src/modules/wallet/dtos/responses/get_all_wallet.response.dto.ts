import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { CurrencyResponseDto } from './relation_wallet.response.dto';

export class GetAllWalletResponseDto {
  @ApiProperty({ name: 'id' })
  @Expose({ name: 'id' })
  id: string;

  @ApiProperty({ name: 'wallet_name' })
  @Expose({ name: 'wltName' })
  wallet_name: string;

  @ApiProperty({ name: 'currency_id' })
  @Expose({ name: 'currencyId' })
  @Type(() => CurrencyResponseDto)
  currency: CurrencyResponseDto;

  @ApiProperty({ name: 'balance' })
  @Expose({ name: 'wltBalance' })
  wallet_balance: number;

  @ApiProperty({ name: 'wallet_type' })
  @Expose({ name: 'wltType' })
  wallet_type: string;
}
