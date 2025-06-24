import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PostType, PostStatus, SortDirection } from '@project/core';

export class PostListQueryDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  public page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 25,
    required: false,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  public limit?: number;

  @ApiProperty({
    description: 'User ID filter',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsString()
  public userId?: string;

  @ApiProperty({
    description: 'Post type filter',
    enum: PostType,
    required: false
  })
  @IsOptional()
  @IsEnum(PostType)
  public type?: PostType;

  @ApiProperty({
    description: 'Tag filter',
    example: 'javascript',
    required: false
  })
  @IsOptional()
  @IsString()
  public tag?: string;

  @ApiProperty({
    description: 'Sort field',
    enum: ['date', 'likes', 'comments'],
    example: 'date',
    required: false
  })
  @IsOptional()
  @IsString()
  public sort?: 'date' | 'likes' | 'comments';

  @ApiProperty({
    description: 'Post status filter',
    enum: PostStatus,
    example: PostStatus.Published,
    required: false
  })
  @IsOptional()
  @IsEnum(PostStatus)
  public status?: PostStatus;

  @ApiProperty({
    description: 'Sort direction',
    enum: SortDirection,
    example: SortDirection.Desc,
    required: false
  })
  @IsOptional()
  @IsEnum(SortDirection)
  public sortDirection?: SortDirection;

  @ApiProperty({
    description: 'Search by post title',
    example: 'My Post Title',
    required: false
  })
  @IsOptional()
  @IsString()
  public title?: string;
} 