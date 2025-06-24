import { Module } from '@nestjs/common';
import { PostLikeController } from './post-likes.controller';
import { PostLikeService } from './post-likes.service';
import { PostLikeRepository } from './post-likes.repository';
import { PostLikeFactory } from './post-likes.factory';

@Module({
  controllers: [PostLikeController],
  providers: [PostLikeService, PostLikeRepository, PostLikeFactory],
  exports: [PostLikeService, PostLikeRepository, PostLikeFactory],
})
export class PostLikesModule {} 