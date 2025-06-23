import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotifyConfigModule, getMongooseOptions } from '@project/notification-config';
import { EmailSubscriberModule } from '@project/email-subscriber';

@Module({
  imports: [
    MongooseModule.forRootAsync(getMongooseOptions()),
    NotifyConfigModule,
    EmailSubscriberModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}