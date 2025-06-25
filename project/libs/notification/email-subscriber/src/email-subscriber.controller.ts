import { Controller } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { EmailSubscriberService } from './email-subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { NewPostNotifyDto } from './dto/new-post-notify.dto';
import { RabbitRouting } from '@project/core';
import { MailService } from './mail-module/mail.service';


@Controller()
export class EmailSubscriberController {
  constructor(
    private readonly subscriberService: EmailSubscriberService,
    private readonly mailService: MailService,
  ) {}

  @RabbitSubscribe({
    exchange: 'readme.notify',
    routingKey: RabbitRouting.AddSubscriber,
    queue: 'readme.notify.income',
  })
  public async create(subscriber: CreateSubscriberDto) {
    this.subscriberService.addSubscriber(subscriber);
    this.mailService.sendNotifyNewSubscriber(subscriber);
  }

  @RabbitSubscribe({
    exchange: 'readme.notify',
    routingKey: RabbitRouting.NewPost,
    queue: 'readme.notify.new-post',
  })
  public async notifyNewPost(postData: NewPostNotifyDto) {
    if (!postData.subscriberEmails || postData.subscriberEmails.length === 0) {
      console.log('No subscribers to notify for post:', postData.postId);
      return;
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
  }
}