import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import notifyConfig from './notify.config';

const ENV_FILE_PATH = 'apps/notification/notification.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [notifyConfig],
      envFilePath: ENV_FILE_PATH
    }),
  ]
})
export class NotifyConfigModule {}