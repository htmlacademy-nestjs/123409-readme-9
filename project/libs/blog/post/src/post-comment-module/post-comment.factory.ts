import { Injectable } from '@nestjs/common';
import { PostCommentEntity } from './post-comment.entity';
import { EntityFactory, PostComment } from '@project/core';

@Injectable()
export class PostCommentFactory implements EntityFactory<PostCommentEntity>{
    public create(entityPlainData: PostComment): PostCommentEntity {
        return new PostCommentEntity(entityPlainData);
    }
} 