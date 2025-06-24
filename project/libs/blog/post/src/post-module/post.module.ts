import { Module } from '@nestjs/common';
import { PostFactory } from './post.factory';
import { PostRepository } from './post.repository';
import { PostController } from './post.controller';
import { PrismaClientModule } from '@project/blog-models';
import { PostService } from './post.service';

@Module({
    imports: [PrismaClientModule],
    providers: [PostFactory, PostRepository, PostService],
    controllers: [PostController],
    exports: [PostRepository],
})
export class PostModule {}