import { ApiProperty } from '@nestjs/swagger';

export class UserLikesRdo {
  @ApiProperty({
    description: 'The unique identifier of the like',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  public id: string;

  @ApiProperty({
    description: 'The unique identifier of the post',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  public postId: string;

  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  public userId: string;

  @ApiProperty({
    description: 'The date when the like was created',
    example: '2024-01-01T00:00:00.000Z'
  })
  public createdAt: Date;
} 