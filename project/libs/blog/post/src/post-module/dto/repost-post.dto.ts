import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RepostPostDto {
  @ApiProperty({
    description: 'User ID who is reposting',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  public userId: string;
} 