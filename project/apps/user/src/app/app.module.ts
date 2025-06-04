import { Module } from '@nestjs/common';
import { BlogUserModule } from '@project/blog-user';
import { AuthenticationModule } from '@project/feature-authentication';
import { AccountConfigModule } from '@project/user-config';

@Module({
  imports: [BlogUserModule, AuthenticationModule, AccountConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
