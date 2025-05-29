import { Module } from '@nestjs/common';
import { PostFactory } from './post.factory';
import { PostRepository } from './post.repository';

@Module({
    providers: [PostFactory, PostRepository],
    exports: [PostRepository],
})
export class PostModule {}