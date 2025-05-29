import { Module } from '@nestjs/common';
import { BlogUserFactory } from './blog-user.factory';
import { BlogUserRepository } from './blog-user.repository';

@Module({
    providers: [BlogUserFactory, BlogUserRepository],
    exports: [BlogUserRepository],
})
export class BlogUserModule {}