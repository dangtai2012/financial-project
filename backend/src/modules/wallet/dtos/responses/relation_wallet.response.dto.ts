import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CurrencyResponseDto {
  @ApiProperty({ name: 'id' })
  @Expose({ name: 'id' })
  id: string;

  @ApiProperty({ name: 'cur_name' })
  @Expose({ name: 'curName' })
  curName: string;

  @ApiProperty({ name: 'cur_symbol' })
  @Expose({ name: 'curSymbol' })
  curSymbol: string;
}
