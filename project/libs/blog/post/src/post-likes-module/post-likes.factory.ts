import { Injectable } from '@nestjs/common';
import { EntityFactory, PostLike } from '@project/core';
import { PostLikeEntity } from './post-likes.entity';

@Injectable()
export class PostLikeFactory implements EntityFactory<PostLikeEntity> {
  public create(postLike: PostLike): PostLikeEntity {
    return new PostLikeEntity(postLike);
  }
} 