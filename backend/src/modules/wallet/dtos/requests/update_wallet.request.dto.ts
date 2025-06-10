import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateWalletRequestDto } from './create_wallet.request.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateWalletRequestDto extends OmitType(CreateWalletRequestDto, [
  'walletType',
]) {
  @ApiProperty({ name: 'id', type: String })
  @Expose({ name: 'id' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
