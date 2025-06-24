import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleSubscribeDto {
  @ApiProperty({
    description: 'ID пользователя, на которого подписываемся/отписываемся',
    example: '507f1f77bcf86cd799439011'
  })
  @IsMongoId({ message: 'Publisher ID must be a valid MongoDB ID' })
  @IsNotEmpty({ message: 'Publisher ID is required' })
  public publisherId: string;
} 