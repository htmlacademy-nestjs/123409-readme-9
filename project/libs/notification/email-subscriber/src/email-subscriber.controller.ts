import { Controller } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { EmailSubscriberService } from './email-subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { NewPostNotifyDto } from './dto/new-post-notify.dto';
import { RabbitRouting } from '@project/core';
import { MailService } from './mail-module/mail.service';
import { NotificationService } from './notification.service';


@Controller()
export class EmailSubscriberController {
  constructor(
    private readonly subscriberService: EmailSubscriberService,
    private readonly mailService: MailService,
    private readonly notificationService: NotificationService,
  ) {}

  @RabbitSubscribe({
    exchange: 'readme.notify',
    routingKey: RabbitRouting.AddSubscriber,
    queue: 'readme.notify.income',
  })
  public async create(subscriber: CreateSubscriberDto) {
    await this.subscriberService.addSubscriber(subscriber);
    await this.mailService.sendNotifyNewSubscriber(subscriber);
  }

  @RabbitSubscribe({
    exchange: 'readme.notify',
    routingKey: RabbitRouting.NewPost,
    queue: 'readme.notify.new-post',
  })
  public async notifyNewPost(postData: NewPostNotifyDto) {
    await this.notificationService.notifyNewPost(postData);
  }
}