import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsArray, IsOptional } from 'class-validator';
import { PostType } from '@project/core';

export class NewPostNotifyDto {
  @ApiProperty({
    description: 'Post ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  public postId: string;

  @ApiProperty({
    description: 'Author ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  public authorId: string;

  @ApiProperty({
    description: 'Author firstname',
    example: 'John'
  })
  @IsString()
  public authorFirstname: string;

  @ApiProperty({
    description: 'Author lastname',
    example: 'Doe'
  })
  @IsString()
  public authorLastname: string;

  @ApiProperty({
    description: 'Post type',
    enum: PostType,
    example: PostType.Text
  })
  @IsEnum(PostType)
  public postType: PostType;

  @ApiProperty({
    description: 'Post title or content preview',
    example: 'Новый интересный пост'
  })
  @IsString()
  public postTitle: string;

  @ApiProperty({
    description: 'Post tags',
    example: ['tag1', 'tag2'],
    required: false
  })
  @IsArray()
  @IsOptional()
  public tags?: string[];

  @ApiProperty({
    description: 'List of subscriber emails to notify',
    example: ['user1@example.com', 'user2@example.com'],
    required: false
  })
  @IsArray()
  @IsOptional()
  public subscriberEmails?: string[];
} 