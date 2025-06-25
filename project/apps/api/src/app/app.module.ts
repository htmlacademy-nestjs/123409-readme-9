import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HTTP_CLIENT_MAX_REDIRECTS, HTTP_CLIENT_TIMEOUT } from './app.config';
import { UsersController } from './users.controller'
import { BlogController } from './blog.controller';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { NotifyService } from './notify.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: HTTP_CLIENT_TIMEOUT,
      maxRedirects: HTTP_CLIENT_MAX_REDIRECTS,
    }),
  ],
  controllers: [UsersController, BlogController],
  providers: [CheckAuthGuard, NotifyService],
})
export class AppModule {}
