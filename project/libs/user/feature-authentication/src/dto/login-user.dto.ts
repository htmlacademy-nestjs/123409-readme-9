import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com'
  })
  public email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123'
  })
  public password: string;
}
