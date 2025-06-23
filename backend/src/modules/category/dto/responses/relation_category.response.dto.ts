import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ name: 'id' })
  @Expose({ name: 'id' })
  id: string;

  @ApiProperty({ name: 'user_email' })
  @Expose({ name: 'usrEmail' })
  user_email: string;

  @ApiProperty({ name: 'user_name' })
  @Expose({ name: 'usrName' })
  user_name: string;
}
