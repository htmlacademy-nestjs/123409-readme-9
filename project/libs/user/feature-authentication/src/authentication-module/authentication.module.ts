import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { BlogUserModule } from '@project/blog-user';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getJwtOptions } from '@project/user-config';
import { NotifyModule } from '@project/user-notify';
import { JwtAccessStrategy } from '../strategies/jwt-access.strategy';

@Module({
  imports: [BlogUserModule, JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: getJwtOptions,
  }),
  NotifyModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtAccessStrategy]
})
export class AuthenticationModule {}