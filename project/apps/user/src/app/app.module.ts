import { Module } from '@nestjs/common';
import { BlogUserModule } from '@project/blog-user';
import { AuthenticationModule } from '@project/feature-authentication';
import { AccountConfigModule, getMongooseOptions } from '@project/user-config';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifyModule } from '@project/user-notify';

@Module({
  imports: [BlogUserModule, AuthenticationModule, AccountConfigModule, MongooseModule.forRootAsync(getMongooseOptions()), NotifyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
