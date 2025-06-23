import { Inject, Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigType } from '@nestjs/config';

import { RabbitRouting } from '@project/core';
import { rabbitConfig } from '@project/user-config';

import { CreateSubscriberDto } from './dto/create-subscriber.dto';

type RabbitConfigType = ConfigType<typeof rabbitConfig>;

@Injectable()
export class NotifyService {
  constructor(
    private readonly rabbitClient: AmqpConnection,
    @Inject(rabbitConfig.KEY)
    private readonly rabbiOptions: RabbitConfigType,
  ) {}

  public async registerSubscriber(dto: CreateSubscriberDto) {
    return this.rabbitClient.publish<CreateSubscriberDto>(
      this.rabbiOptions.exchange,
      RabbitRouting.AddSubscriber,
      { ...dto }
    );
  }
}