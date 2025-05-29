import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends CreatePostDto {
  @ApiProperty({
    description: 'Post id',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  public id: string;
}
