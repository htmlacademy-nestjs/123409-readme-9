import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsBoolean, IsDate, IsOptional, ValidateNested, IsArray, ArrayMaxSize } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { PostType, PostStatus } from '@project/core';
import { VideoPostContent, TextPostContent, QuotePostContent, PhotoPostContent, LinkPostContent } from '@project/core';

export class PostRdo {
  @Expose()
  public id: string;


  @Expose()
  public type: PostType;

  
  @Expose()
  public status: PostStatus;

  @Expose()
  public originalAuthorId?: string;

  @Expose()
  public originalPostId?: string;

  @Expose()
  public isRepost: boolean;

  @Expose()
  public createdAt: Date;

  @Expose()
  public publishedAt: Date;

  @Expose()
  public content: VideoPostContent | TextPostContent | QuotePostContent | PhotoPostContent | LinkPostContent;

  @Expose()
  public tags: string[];

  @Expose()
  public commentsCount: number;

  @Expose()
  public likesCount: number;
}
