import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { Subscriber } from '@project/core';
import { NotifyConfig } from '@project/notification-config';

import { emailMessages } from './mail.constant';
import { NewPostNotifyDto } from '../dto/new-post-notify.dto';

type NotifyConfig = ConfigType<typeof NotifyConfig>;

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  @Inject(NotifyConfig.KEY)
  private readonly notifyConfig: NotifyConfig;

  public async sendNotifyNewSubscriber(subscriber: Subscriber) {
    await this.mailerService.sendMail({
      from: this.notifyConfig.mail.from,
      to: subscriber.email, 
      subject: emailMessages.ADD_SUBSCRIBER_SUBJECT,
      template: './add-subscriber',
      context: {
        user: `${subscriber.firstname} ${subscriber.lastname}`,
        email: `${subscriber.email}`,
      }
    })
  }

  public async sendNotifyNewPost(subscriber: Subscriber, postData: NewPostNotifyDto) {
    await this.mailerService.sendMail({
      from: this.notifyConfig.mail.from,
      to: subscriber.email,
      subject: emailMessages.NEW_POST_SUBJECT,
      template: './new-post',
      context: {
        user: `${subscriber.firstname} ${subscriber.lastname}`,
        author: `${postData.authorFirstname} ${postData.authorLastname}`,
        postTitle: postData.postTitle,
        postType: postData.postType,
        postId: postData.postId,
        tags: postData.tags?.join(', ') || 'без тегов',
      }
    })
  }
}