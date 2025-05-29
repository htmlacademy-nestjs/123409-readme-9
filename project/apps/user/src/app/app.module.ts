import { Module } from '@nestjs/common';
import { BlogUserModule } from '@project/blog-user';
import { AuthenticationModule } from '@project/feature-authentication';

@Module({
  imports: [BlogUserModule, AuthenticationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
