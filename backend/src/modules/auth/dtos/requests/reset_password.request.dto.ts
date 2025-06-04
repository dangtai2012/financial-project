import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordRequestDto {
  @ApiProperty({ name: 'new_password', type: String })
  @Expose({ name: 'new_password' })
  @MinLength(8)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({ name: 'confirm_new_password', type: String })
  @Expose({ name: 'confirm_new_password' })
  @MinLength(8)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  confirmNewPassword: string;
}
