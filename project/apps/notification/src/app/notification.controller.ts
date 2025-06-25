import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmailSubscriberService } from '@project/email-subscriber';
import { MailService } from '@project/email-subscriber';

export interface NewPostNotifyDto {
  postId: string;
  authorId: string;
  authorFirstname: string;
  authorLastname: string;
  postType: string;
  postTitle: string;
  tags?: string[];
  subscriberEmails?: string[];
}

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly subscriberService: EmailSubscriberService,
    private readonly mailService: MailService,
  ) {}

  @Post('notify/new-post')
  @ApiOperation({ summary: 'Notify subscribers about new post' })
  @ApiResponse({
    status: 200,
    description: 'Notifications sent successfully.'
  })
  public async notifyNewPost(@Body() postData: NewPostNotifyDto) {
    if (!postData.subscriberEmails || postData.subscriberEmails.length === 0) {
      console.log('No subscribers to notify for post:', postData.postId);
      return { message: 'No subscribers to notify' };
    }

    // Получаем подписчиков по их email адресам
    const subscribers = await Promise.all(
      postData.subscriberEmails.map((email: string) => 
        this.subscriberService.findByEmail(email)
      )
    );

    // Отправляем уведомления только существующим подписчикам
    for (const subscriber of subscribers) {
      if (subscriber) {
        await this.mailService.sendNotifyNewPost(subscriber, postData);
      }
    }

    return { message: 'Notifications sent successfully' };
  }
} 