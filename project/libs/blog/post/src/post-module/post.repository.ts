import { Injectable, NotFoundException } from "@nestjs/common";

import { BasePostgresRepository } from "@project/data-access";

import { PostEntity } from "./post.entity";
import { PostFactory } from "./post.factory";
import { PaginationResult, Post, SortDirection } from "@project/core";
import { PrismaClientService } from "@project/blog-models";
import { PostType, PostStatus, PostContent } from "@project/core";
import { Prisma, Post as PrismaPost } from "@prisma/client";
import { PostListQueryDto } from "./dto/post-list-query.dto";

export type PostSortType = "date" | "likes" | "comments";

export interface PostListQuery {
  page?: number;
  limit?: number;
  userId?: string;
  type?: PostType;
  tag?: string;
  sort?: PostSortType;
  status?: PostStatus;
  sortDirection?: SortDirection;
  title?: string;
}

@Injectable()
export class PostRepository extends BasePostgresRepository<PostEntity, Post> {
  constructor(entityFactory: PostFactory, prisma: PrismaClientService) {
    super(entityFactory, prisma);
  }

  private transformRecord(
    record: PrismaPost & { _count?: { likes: number; comments: number } }
  ): Post {
    return {
      ...record,
      type: record.type as PostType,
      status: record.status as PostStatus,
      content: record.content as unknown as PostContent,
      originalAuthorId: record.originalAuthorId || undefined,
      originalPostId: record.originalPostId || undefined,
      likesCount: record._count?.likes ?? 0,
      commentsCount: record._count?.comments ?? 0,
    };
  }

  public override async save(entity: PostEntity): Promise<PostEntity> {
    const pojo = entity.toPOJO();
    const { id, likesCount, commentsCount, ...postData } = pojo;
    
    const record = await this.client.post.create({
      data: {
        ...postData,
        content: JSON.stringify(postData.content),
      },
    });

    entity.id = record.id;
    return entity;
  }

  public override async deleteById(id: string): Promise<void> {
    await this.client.post.delete({
      where: {
        id,
      },
    });
  }

  public override async findById(id: string): Promise<PostEntity> {
    const record = await this.client.post.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!record) {
      throw new NotFoundException("Post not found");
    }

    const post = this.transformRecord(record);
    return this.createEntityFromDocument(post);
  }

  public override async update(entity: PostEntity): Promise<void> {
    const pojo = entity.toPOJO();
    const { likesCount, commentsCount, ...postData } = pojo;
    
    await this.client.post.update({
      where: { id: entity.id },
      data: {
        ...postData,
        content: JSON.stringify(postData.content),
      },
    });
  }

  public async find(
    query: PostListQueryDto
  ): Promise<PaginationResult<PostEntity>> {
    const {
      page = 1,
      limit = 25,
      userId,
      type,
      tag,
      sort = "date",
      status = PostStatus.Published,
      sortDirection = SortDirection.Desc,
      title,
    } = query;
    const skip = page && limit ? (page - 1) * limit : undefined;

    const where = {
      status,
      ...(userId && { authorId: userId }),
      ...(type && { type }),
      ...(tag && { tags: { has: tag } }),
      ...(title && {
        content: {
          path: ['$.title'],
          string_contains: title,
        },
      }),
    };

    const orderBy = this.getOrderByClause(sort, sortDirection);
    const [records, totalItems] = await Promise.all([
      this.client.post.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy,
        include: {
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),
      this.client.post.count({ where })
    ]);

    return {
      entities: records.map((record) => {
        const post = this.transformRecord(record);
        return this.createEntityFromDocument(post);
      }),
      totalPages: Math.ceil(totalItems / limit),
      totalItems: totalItems,
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  private getOrderByClause(sort: PostSortType, sortDirection: SortDirection) {
    const direction = sortDirection === SortDirection.Asc ? "asc" : "desc";
    switch (sort) {
      case "likes":
        return {
          likes: {
            _count: direction as Prisma.SortOrder,
          },
        };
      case "comments":
        return {
          comments: {
            _count: direction as Prisma.SortOrder,
          },
        };
      case "date":
      default:
        return {
          publishedAt: direction as Prisma.SortOrder,
        };
    }
  }

  public async findDrafts(userId: string): Promise<PostEntity[]> {
    const result = await this.find({
      userId,
      status: PostStatus.Draft,
    });
    return result.entities;
  }

  public async findPostsBySubscriptions(
    subscriptions: string[],
    query: PostListQueryDto
  ): Promise<PaginationResult<PostEntity>> {
    const {
      page = 1,
      limit = 25,
      type,
      tag,
      sort = "date",
      status = PostStatus.Published,
      sortDirection = SortDirection.Desc,
      title,
    } = query;
    const skip = page && limit ? (page - 1) * limit : undefined;

    if (!subscriptions || subscriptions.length === 0) {
      return {
        entities: [],
        totalPages: 0,
        totalItems: 0,
        currentPage: page,
        itemsPerPage: limit,
      };
    }

    const where = {
      status,
      authorId: { in: subscriptions },
      ...(type && { type }),
      ...(tag && { tags: { has: tag } }),
      ...(title && {
        content: {
          path: ['$.title'],
          string_contains: title,
        },
      }),
    };

    const orderBy = this.getOrderByClause(sort, sortDirection);
    const [records, totalItems] = await Promise.all([
      this.client.post.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy,
        include: {
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),
      this.client.post.count({ where })
    ]);

    return {
      entities: records.map((record) => {
        const post = this.transformRecord(record);
        return this.createEntityFromDocument(post);
      }),
      totalPages: Math.ceil(totalItems / limit),
      totalItems: totalItems,
      currentPage: page,
      itemsPerPage: limit,
    };
  }
}
