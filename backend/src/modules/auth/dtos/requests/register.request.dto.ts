import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUppercase,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({ name: 'email', type: String, example: 'alan@mail.com' })
  @Expose({ name: 'email' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail({}, { message: 'Invalid email format.' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ name: 'password', type: String, example: 'P@ssw0rd' })
  @Expose({ name: 'password' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ name: 'name', type: String, example: 'Alan' })
  @Expose({ name: 'name' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  name: string;
}
