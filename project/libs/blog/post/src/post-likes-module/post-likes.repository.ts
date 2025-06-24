import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PostLikeEntity } from "./post-likes.entity";
import { BasePostgresRepository } from "@project/data-access";
import { PostLikeFactory } from "./post-likes.factory";
import { PrismaClientService } from "@project/blog-models";
import { PostLike } from "@project/core";

@Injectable()
export class PostLikeRepository extends BasePostgresRepository<
  PostLikeEntity,
  PostLike
> {
  constructor(entityFactory: PostLikeFactory, prisma: PrismaClientService) {
    super(entityFactory, prisma);
  }

  public override async save(entity: PostLikeEntity): Promise<PostLikeEntity> {
    const record = await this.client.postLike.create({
      data: { ...entity.toPOJO() }
    });

    entity.id = record.id;
    return entity;
  }

  public override async findById(id: string): Promise<PostLikeEntity> {
    const record = await this.client.postLike.findUnique({
      where: { id }
    });

    if (!record) {
      throw new NotFoundException(`Post like with id ${id} not found.`);
    }
    
    return this.entityFactory.create(record);
  }

  public async findByPostId(postId: string): Promise<PostLikeEntity[]> {
    const records = await this.client.postLike.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' }
    });

    return records.map((record) => this.entityFactory.create(record));
  }

  public async findByUserAndPost(userId: string, postId: string): Promise<PostLikeEntity | null> {
    const record = await this.client.postLike.findFirst({
      where: {
        userId,
        postId
      }
    });

    return record ? this.entityFactory.create(record) : null;
  }

  public async findByUserId(userId: string): Promise<PostLikeEntity[]> {
    const records = await this.client.postLike.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    Logger.log('records', records);

    return records.map((record) => {
      Logger.log('record', record);
      Logger.log('recordCreate', this.entityFactory.create(record));
      return this.entityFactory.create(record);
    });
  }

  public async deleteByUserAndPost(userId: string, postId: string): Promise<void> {
    await this.client.postLike.deleteMany({
      where: {
        userId,
        postId
      }
    });
  }

  public override async deleteById(id: string): Promise<void> {
    await this.client.postLike.delete({
      where: { id }
    });
  }
} 