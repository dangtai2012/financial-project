import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class CreateWalletResponseDto {
  @ApiProperty({ name: 'wallet_name' })
  @Expose({ name: 'walletName' })
  wallet_name: string;

  @ApiProperty({ name: 'currency_id' })
  @Expose({ name: 'currencyId' })
  @Transform(({ obj }) => obj.currencyId.id)
  currency_id: string;

  @ApiProperty({ name: 'initial_balance' })
  @Expose({ name: 'initialBalance' })
  initial_balance: number;

  @ApiProperty({ name: 'wallet_type' })
  @Expose({ name: 'walletType' })
  wallet_type: string;
}
