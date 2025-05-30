import { Module } from '@nestjs/common';
import { PostCommentModule, PostModule } from '@project/post';

@Module({
  imports: [PostModule, PostCommentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
