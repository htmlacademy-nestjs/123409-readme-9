import { Module } from '@nestjs/common';
import { PostCommentFactory } from './post-comment.factory';
import { PostCommentRepository } from './post-comment.repository';
import { PostCommentController } from './post-comment.controller';
import { PostCommentService } from './post-comment.service';

@Module({
    providers: [PostCommentFactory, PostCommentRepository, PostCommentService],
    controllers: [PostCommentController],
    exports: [PostCommentRepository],
})
export class PostCommentModule {} 