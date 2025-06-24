import { Module } from '@nestjs/common';
import { PostCommentModule, PostLikesModule, PostModule } from '@project/post';


@Module({
  imports: [PostModule, PostCommentModule, PostLikesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
