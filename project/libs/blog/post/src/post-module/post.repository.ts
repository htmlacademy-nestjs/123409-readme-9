import { Injectable, NotFoundException } from '@nestjs/common';

import { BasePostgresRepository } from '@project/data-access';

import { PostEntity } from './post.entity';
import { PostFactory } from './post.factory';
import { Post } from '@project/core';
import { PrismaClientService } from '@project/blog-models';
import { PostType, PostStatus, PostContent } from '@project/core';
import { Post as PrismaPost } from '@prisma/client';

export type PostSortType = 'date' | 'likes' | 'comments';

export interface PostListQuery {
  page?: number;
  limit?: number;
  userId?: string;
  type?: PostType;
  tag?: string;
  sort?: PostSortType;
  status?: PostStatus;
}

@Injectable()
export class PostRepository extends BasePostgresRepository<PostEntity, Post> {
  constructor(entityFactory: PostFactory, prisma: PrismaClientService) {
    super(entityFactory, prisma);
  }

  private transformRecord(record: PrismaPost & { _count?: { likes: number; comments: number } }): Post {
    return {
      ...record,
      type: record.type as PostType,
      status: record.status as PostStatus,
      content: record.content as unknown as PostContent,
      originalAuthorId: record.originalAuthorId || undefined,
      originalPostId: record.originalPostId || undefined,
      likesCount: record._count?.likes ?? 0,
      commentsCount: record._count?.comments ?? 0
    };
  }

  public override async save (entity: PostEntity): Promise<PostEntity> {
    const pojo = entity.toPOJO();
    const record = await this.client.post.create({
      data: { 
        ...pojo,
        content: JSON.stringify(pojo.content)
      }
    });

    entity.id = record.id;
    return entity;
  }

  public override async update(entity: PostEntity): Promise<void> {
    const pojo = entity.toPOJO();
    await this.client.post.update({
      where: { id: entity.id },
      data: {
        ...pojo,
        content: JSON.stringify(pojo.content)
      }
    });
  }

  public override async findById(id: string): Promise<PostEntity> {
    const record = await this.client.post.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    if (!record) {
      throw new NotFoundException('Post not found');
    }

    const post = this.transformRecord(record);
    const entity = this.createEntityFromDocument(post);
    if (!entity) {
      throw new NotFoundException('Post not found');
    }
    return entity;
  }

  public async find(query: PostListQuery): Promise<PostEntity[]> {
    const { page = 1, limit = 25, userId, type, tag, sort = 'date', status = PostStatus.Published } = query;
    const skip = (page - 1) * limit;

    const where = {
      status,
      ...(userId && { authorId: userId }),
      ...(type && { type }),
      ...(tag && { tags: { has: tag } })
    };

    const orderBy = this.getOrderByClause(sort);
    const records = await this.client.post.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    return records.map(record => {
      const post = this.transformRecord(record);
      const entity = this.createEntityFromDocument(post);
      if (!entity) {
        throw new Error('Failed to create entity from document');
      }
      return entity;
    });
  }

  private getOrderByClause(sort: PostSortType) {
    switch (sort) {
      case 'likes':
        return {
          likes: {
            _count: 'desc' as const
          }
        };
      case 'comments':
        return {
          comments: {
            _count: 'desc' as const
          }
        };
      case 'date':
      default:
        return {
          publishedAt: 'desc' as const
        };
    }
  }

  public async findDrafts(userId: string): Promise<PostEntity[]> {
    return this.find({
      userId,
      status: PostStatus.Draft
    });
  }
}