import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CurrencyResponseDto } from './relation_wallet.response.dto';

export class CreateWalletResponseDto {
  @ApiProperty({ name: 'id' })
  @Expose({ name: 'id' })
  id: string;

  @ApiProperty({ name: 'wallet_name' })
  @Expose({ name: 'walletName' })
  wallet_name: string;

  @ApiProperty({ name: 'currency_id' })
  @Expose({ name: 'currencyId' })
  @Type(() => CurrencyResponseDto)
  currency_id: CurrencyResponseDto;

  @ApiProperty({ name: 'wallet_balance' })
  @Expose({ name: 'walletBalance' })
  wallet_balance: number;

  @ApiProperty({ name: 'wallet_type' })
  @Expose({ name: 'walletType' })
  wallet_type: string;
}
