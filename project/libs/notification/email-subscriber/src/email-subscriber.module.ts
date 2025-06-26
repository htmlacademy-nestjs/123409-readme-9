import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EmailSubscriberModel, EmailSubscriberSchema } from './email-subscriber.model';
import { EmailSubscriberService } from './email-subscriber.service';
import { EmailSubscriberRepository } from './email-subscriber.repository';
import { EmailSubscriberFactory } from './email-subscriber.factory';
import { MailModule } from './mail-module/mail.module';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { getRabbitMQOptions } from '@project/helpers';
import { EmailSubscriberController } from './email-subscriber.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailSubscriberModel.name, schema: EmailSubscriberSchema }
    ]),
    RabbitMQModule.forRootAsync(
      RabbitMQModule,
      getRabbitMQOptions('application.rabbit')
    ),
    MailModule,
  ],
  controllers: [EmailSubscriberController, NotificationController],
  providers: [
    EmailSubscriberService,
    EmailSubscriberRepository,
    EmailSubscriberFactory,
    NotificationService,
  ],
  exports: [
    EmailSubscriberService,
    MailModule,
    NotificationService,
  ]
})
export class EmailSubscriberModule {}