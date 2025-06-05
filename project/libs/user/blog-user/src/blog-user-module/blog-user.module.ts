import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlogUserFactory } from './blog-user.factory';
import { BlogUserRepository } from './blog-user.repository';
import { BlogUserModel, BlogUserSchema } from './blog-user.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: BlogUserModel.name, schema: BlogUserSchema },
        ]),
    ],
    providers: [BlogUserFactory, BlogUserRepository],
    exports: [BlogUserRepository],
})
export class BlogUserModule {}