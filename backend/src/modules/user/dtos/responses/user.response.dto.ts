import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty()
  @Expose({ name: 'id' })
  id: string;

  @ApiProperty()
  @Expose({ name: 'name' })
  name: string;

  @ApiProperty()
  @Expose({ name: 'email' })
  email: string;
}
