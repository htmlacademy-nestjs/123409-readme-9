import { Module } from '@nestjs/common';
import { PostCommentFactory } from './post-comment.factory';
import { PostCommentRepository } from './post-comment.repository';
import { PostCommentController } from './post-comment.controller';

@Module({
    providers: [PostCommentFactory, PostCommentRepository],
    controllers: [PostCommentController],
    exports: [PostCommentRepository],
})
export class PostCommentModule {} 