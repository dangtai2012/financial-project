import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordRequestDto {
  @ApiProperty({ name: 'email', type: String, example: 'alan@mail.com' })
  @Expose({ name: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
