import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com'
  })
  public email: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe'
  })
  public name: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123'
  })
  public password: string;
}
