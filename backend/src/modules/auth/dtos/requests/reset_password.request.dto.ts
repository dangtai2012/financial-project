import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordRequestDto {
  @ApiProperty({ name: 'new_password', type: String })
  @Expose({ name: 'new_password' })
  @MinLength(8)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
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
