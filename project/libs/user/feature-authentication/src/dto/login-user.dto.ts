import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AUTH_USER_EMAIL_NOT_VALID } from '../authentication-module/authentication.constant';

export class LoginUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com'
  })
  @IsEmail({}, { message: AUTH_USER_EMAIL_NOT_VALID })
  @IsNotEmpty()
  public email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123'
  })
  @IsString()
  @IsNotEmpty()
  public password: string;
}
