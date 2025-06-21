import { Injectable, NotFoundException } from "@nestjs/common";
import { PostCommentEntity } from "./post-comment.entity";
import { BasePostgresRepository } from "@project/data-access";
import { PostCommentFactory } from "./post-comment.factory";
import { PrismaClientService } from "@project/blog-models";
import { PostComment, PaginationResult } from "@project/core";

export interface PostCommentListQuery {
  page?: number;
  limit?: number;
}


@Injectable()
export class PostCommentRepository extends BasePostgresRepository<
  PostCommentEntity,
  PostComment
> {
  constructor(entityFactory: PostCommentFactory, prisma: PrismaClientService) {
    super(entityFactory, prisma);
  }

  public override async save(entity: PostCommentEntity): Promise<PostCommentEntity> {
    const record = await this.client.postComment.create({
      data: { ...entity.toPOJO() }
    });

    entity.id = record.id;
    return entity;
  }

  public override async findById(id: string): Promise<PostCommentEntity> {
    const record = await this.client.postComment.findUnique({
      where: { id }
    });

    if (! record) {
      throw new NotFoundException(`Comment with id ${id} not found.`);
    }
    
    return this.entityFactory.create(record);
  }

  public async findByPostId(postId: string, query: PostCommentListQuery): Promise<PaginationResult<PostCommentEntity>> {
    const { page = 1, limit = 50 } = query; 
    const skip = page && limit ? (page - 1) * limit : undefined;
    const where = { postId };
    const [records, totalItems] = await Promise.all([
      this.client.postComment.findMany({
        where,
        skip,
        take: limit
      }),
      this.client.postComment.count({ where })
    ]);

    return {
      entities: records.map(this.entityFactory.create),
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      currentPage: page,
      itemsPerPage: limit
    };
  }

  public override async deleteById(id: string): Promise<void> {
    await this.client.postComment.delete({
      where: { id }
    });
  }  
}
