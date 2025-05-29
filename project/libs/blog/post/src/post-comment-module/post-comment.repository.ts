import { Injectable } from '@nestjs/common';
import { PostCommentEntity } from './post-comment.entity';
import { BaseMemoryRepository } from '@project/data-access';
import { PostCommentFactory } from './post-comment.factory';

@Injectable()
export class PostCommentRepository extends BaseMemoryRepository<PostCommentEntity> {
    constructor(entityFactory: PostCommentFactory) {
        super(entityFactory);
      }
} 