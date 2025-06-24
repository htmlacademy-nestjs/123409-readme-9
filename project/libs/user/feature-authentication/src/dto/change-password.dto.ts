import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'oldPassword123'
  })
  @IsString()
  @IsNotEmpty()
  public oldPassword: string;

  @ApiProperty({
    description: 'New password',
    example: 'newPassword456'
  })
  @IsString()
  @IsNotEmpty()
  public newPassword: string;
} 