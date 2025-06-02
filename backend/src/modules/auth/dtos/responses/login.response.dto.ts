import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginResponseDto {
  @ApiProperty({ name: 'access_token' })
  @Expose({ name: 'accessToken' })
  access_token: string;

  @ApiProperty({ name: 'refresh_token' })
  @Expose({ name: 'refreshToken' })
  refresh_token: string;
}
