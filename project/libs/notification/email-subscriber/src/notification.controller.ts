import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NewPostNotifyDto } from './dto/new-post-notify.dto';
import { NotificationService } from './notification.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Post('notify/new-post')
  @ApiOperation({ summary: 'Notify subscribers about new post' })
  @ApiResponse({
    status: 200,
    description: 'Notifications sent successfully.'
  })
  public async notifyNewPost(@Body() postData: NewPostNotifyDto) {
    return await this.notificationService.notifyNewPost(postData);
  }
} 