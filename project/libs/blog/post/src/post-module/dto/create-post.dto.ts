import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsBoolean, IsDate, IsOptional, ValidateNested, IsArray, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { PostType, PostStatus } from '@project/core';
import { VideoPostContent, TextPostContent, QuotePostContent, PhotoPostContent, LinkPostContent } from '@project/core';

export class CreatePostDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  public userId: string;

  @ApiProperty({
    description: 'Post type',
    enum: PostType,
    example: PostType.Text
  })
  @IsEnum(PostType)
  public type: PostType;

  @ApiProperty({
    description: 'Post status',
    enum: PostStatus,
    example: PostStatus.Draft
  })
  @IsEnum(PostStatus)
  public status: PostStatus;

  @ApiProperty({
    description: 'Original author ID (for reposts)',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsOptional()
  public originalAuthorId?: string;

  @ApiProperty({
    description: 'Original post ID (for reposts)',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsOptional()
  public originalPostId?: string;

  @ApiProperty({
    description: 'Is this post a repost',
    example: false
  })
  @IsBoolean()
  public isRepost: boolean;

  @ApiProperty({
    description: 'Post creation date',
    example: '2024-03-20T12:00:00Z'
  })
  @IsDate()
  @Type(() => Date)
  public createdAt: Date;

  @ApiProperty({
    description: 'Post publication date',
    example: '2024-03-20T12:00:00Z',
    required: false
  })
  @IsDate()
  @Type(() => Date)
  public publishedAt: Date;

  @ApiProperty({
    description: 'Post content',
    oneOf: [
      { $ref: '#/components/schemas/VideoPostContent' },
      { $ref: '#/components/schemas/TextPostContent' },
      { $ref: '#/components/schemas/QuotePostContent' },
      { $ref: '#/components/schemas/PhotoPostContent' },
      { $ref: '#/components/schemas/LinkPostContent' }
    ]
  })
  @ValidateNested()
  @Type(() => Object)
  public content: VideoPostContent | TextPostContent | QuotePostContent | PhotoPostContent | LinkPostContent;

  @ApiProperty({
    description: 'Post tags',
    example: ['tag1', 'tag2'],
    maxItems: 8
  })
  @IsArray()
  @ArrayMaxSize(8)
  public tags: string[];
}
