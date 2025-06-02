import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({ name: 'email', type: String, example: 'alan@mail.com' })
  @Expose({ name: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ name: 'password', type: String, example: 'password' })
  @Expose({ name: 'password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ name: 'name', type: String, example: 'A Lăng đi bộ' })
  @Expose({ name: 'name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
