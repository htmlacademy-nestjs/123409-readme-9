import { Injectable } from '@nestjs/common';
import { EmailSubscriberService } from './email-subscriber.service';
import { MailService } from './mail-module/mail.service';
import { NewPostNotifyDto } from './dto/new-post-notify.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly subscriberService: EmailSubscriberService,
    private readonly mailService: MailService,
  ) {}

  public async notifyNewPost(postData: NewPostNotifyDto): Promise<{ message: string }> {
    if (!postData.subscriberEmails || postData.subscriberEmails.length === 0) {
      console.log('No subscribers to notify for post:', postData.postId);
      return { message: 'No subscribers to notify' };
    }

    const subscribers = await Promise.all(
      postData.subscriberEmails.map((email: string) => 
        this.subscriberService.findByEmail(email)
      )
    );

    for (const subscriber of subscribers) {
      if (subscriber) {
        await this.mailService.sendNotifyNewPost(subscriber, postData);
      }
    }

    return { message: 'Notifications sent successfully' };
  }
} 