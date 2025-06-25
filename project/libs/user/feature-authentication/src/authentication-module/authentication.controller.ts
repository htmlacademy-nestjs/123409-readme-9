import { Controller, Post, Body, Param, Get, Req, UseGuards, UnauthorizedException, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { ToggleSubscribeDto } from '../dto/toggle-subscribe.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { MongoIdValidationPipe } from '@project/pipes';
import { fillDto } from '@project/helpers';
import { LoggedUserRdo } from '../rdo/logged-user.rdo';
import { NotifyService } from '@project/user-notify';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ChangePasswordDto } from '../dto/change-password.dto';

import type { RequestWithTokenPayload } from './request-with-token-payload.interface';
import type { RequestWithUser } from './request-with-user.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly notifyService: NotifyService
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: CreateUserDto
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'User with this email already exists.' })
  public async create(@Body() dto: CreateUserDto) {
    const newUser = await this.authService.register(dto);

    const { email, firstname, lastname } = newUser;
    await this.notifyService.registerSubscriber({ email, firstname, lastname });

    const userToken = await this.authService.createUserToken(newUser);
    return fillDto(LoggedUserRdo, { ...newUser.toPOJO(), ...userToken });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: LoginUserDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async login(@Req() { user }: RequestWithUser) {
    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }
    const userToken = await this.authService.createUserToken(user);
    return fillDto(LoggedUserRdo, { ...user.toPOJO(), ...userToken });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully found.',
    type: CreateUserDto
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  public async show(@Param('id', MongoIdValidationPipe) id: string) {
    const existUser = await this.authService.getUser(id);
    return existUser.toPOJO();
  }


  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get a new access/refresh tokens'
  })
  public async refreshToken(@Req() { user }: RequestWithUser) {
    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }
    return this.authService.createUserToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('check')
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return payload;
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  public async changePassword(@Req() { user: payload }: RequestWithTokenPayload, @Body() dto: ChangePasswordDto) {
    if (!payload) {
      throw new UnauthorizedException('User not found in request');
    }
    return this.authService.changePassword(payload.sub, dto);
  }

  @Post('toggle-subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle subscription to user' })
  @ApiResponse({
    status: 200,
    description: 'Subscription toggled successfully',
    schema: {
      type: 'object',
      properties: {
        isSubscribed: {
          type: 'boolean',
          description: 'Whether user is now subscribed'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  public async toggleSubscribe(
    @Body() dto: ToggleSubscribeDto,
    @Req() { user: payload }: RequestWithTokenPayload
  ) {
    if (!payload) {
      throw new UnauthorizedException('User not found in request');
    }
    const subscriberId = payload.sub;
    return this.authService.toggleSubscribe(subscriberId, dto);
  }
}
