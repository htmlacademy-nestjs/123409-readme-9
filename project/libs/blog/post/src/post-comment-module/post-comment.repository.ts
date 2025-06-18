import { Injectable, NotFoundException } from "@nestjs/common";
import { PostCommentEntity } from "./post-comment.entity";
import { BasePostgresRepository } from "@project/data-access";
import { PostCommentFactory } from "./post-comment.factory";
import { PrismaClientService } from "@project/blog-models";
import { PostComment } from "@project/core";

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

  public async findByPostId(postId: string): Promise<PostCommentEntity[]> {
    const records = await this.client.postComment.findMany({
      where: { postId }
    });

    return records.map(this.entityFactory.create);
  }

  public override async deleteById(id: string): Promise<void> {
    await this.client.postComment.delete({
      where: { id }
    });
  }  
}
