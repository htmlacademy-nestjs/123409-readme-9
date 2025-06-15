import { Module } from '@nestjs/common';
// import { PostCommentModule, PostModule } from '@project/post';
import { PostModule } from '@project/post';


@Module({
  // imports: [PostModule, PostCommentModule],
  imports: [PostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
