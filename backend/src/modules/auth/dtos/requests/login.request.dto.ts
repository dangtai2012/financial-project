import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ name: 'email', type: String, example: 'test@mail.com' })
  @Expose({ name: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ name: 'password', type: String, example: 'P@ssw0rd' })
  @Expose({ name: 'password' })
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;
}
