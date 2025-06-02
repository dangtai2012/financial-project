import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RegisterResponseDto {
  @ApiProperty()
  @Expose({ name: 'email' })
  email: string;

  @ApiProperty()
  @Expose({ name: 'name' })
  name: string;
}
