import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import rabbitConfig from './configurations/rabbit.config';
import jwtConfig from './configurations/jwt.config';

import appConfig from './configurations/app.config';
import mongoConfig from './configurations/mongo.config';
const ENV_USERS_FILE_PATH = 'apps/user/user.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, mongoConfig, rabbitConfig, jwtConfig],
      envFilePath: ENV_USERS_FILE_PATH
    }),
  ]
})
export class AccountConfigModule {}