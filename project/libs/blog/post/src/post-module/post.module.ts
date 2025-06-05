import { Module } from '@nestjs/common';
import { PostFactory } from './post.factory';
import { PostRepository } from './post.repository';
import { PostController } from './post.controller';

@Module({
    providers: [PostFactory, PostRepository],
    controllers: [PostController],
    exports: [PostRepository],
})
export class PostModule {}