import { Module } from '@nestjs/common';
import { PostCommentFactory } from './post-comment.factory';
import { PostCommentRepository } from './post-comment.repository';

@Module({
    providers: [PostCommentFactory, PostCommentRepository],
    exports: [PostCommentRepository],
})
export class PostCommentModule {} 