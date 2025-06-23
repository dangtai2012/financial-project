import { OmitType } from '@nestjs/swagger';
import { CreateWalletRequestDto } from './create_wallet.request.dto';

export class UpdateWalletRequestDto extends OmitType(CreateWalletRequestDto, [
  'wltType',
]) {}
