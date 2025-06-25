import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
  Inject,
  BadRequestException,
} from "@nestjs/common";
import { BlogUserRepository, BlogUserEntity } from "@project/blog-user";
import { AuthUser, User,Token } from "@project/core";

import { CreateUserDto } from "../dto/create-user.dto";
import { LoginUserDto } from "../dto/login-user.dto";
import { ToggleSubscribeDto } from "../dto/toggle-subscribe.dto";
import {
  AUTH_USER_EXISTS,
  AUTH_USER_NOT_FOUND,
  AUTH_USER_PASSWORD_WRONG,
} from "./authentication.constant";
import { JwtService } from "@nestjs/jwt";
import type { ConfigType } from "@nestjs/config";
import { jwtConfig } from "@project/user-config";
import { RefreshTokenService } from "../refresh-token-module/refresh-token.service";
import { createJWTPayload } from "@project/helpers";
import crypto from "node:crypto";

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);
  constructor(
    private readonly blogUserRepository: BlogUserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    @Inject(jwtConfig.KEY) private readonly jwtOptions: ConfigType<typeof jwtConfig>,
  ) {}

  public async register(dto: CreateUserDto) {
    const { email, firstname, lastname, password } = dto;

    const blogUser: AuthUser = {
      email,
      firstname,
      lastname,
      avatar: "",
      createAt: new Date(),
      publicationsCount: 0,
      subscribersCount: 0,
      passwordHash: "",
      subscriptions: [],
    };

    const existUser = await this.blogUserRepository.findByEmail(email);

    if (existUser) {
      throw new ConflictException(AUTH_USER_EXISTS);
    }

    const userEntity = await new BlogUserEntity(blogUser).setPassword(password);

    return await this.blogUserRepository.save(userEntity);
  }

  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (!existUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }

    if (!(await existUser.comparePassword(password))) {
      throw new UnauthorizedException(AUTH_USER_PASSWORD_WRONG);
    }

    return existUser;
  }

  public async getUser(id: string) {
    const user = await this.blogUserRepository.findById(id);

    if (!user) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }

    return user;
  }

  public async getUserByEmail(email: string) {
    const user = await this.blogUserRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }
  }

  public async createUserToken(user: User): Promise<Token> {
    const accessTokenPayload = createJWTPayload(user);
    const refreshTokenPayload = { ...accessTokenPayload, tokenId: crypto.randomUUID() };
    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);

    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);

      const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.jwtOptions.refreshTokenSecret,
        expiresIn: this.jwtOptions.refreshTokenExpiresIn
      });

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('[Token generation error]: ' + (error instanceof Error ? error.message : String(error)));
      throw new HttpException('Ошибка при создании токена.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async changePassword(userId: string, dto: { oldPassword: string, newPassword: string }) {
    const user = await this.blogUserRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }
    if (!(await user.comparePassword(dto.oldPassword))) {
      throw new UnauthorizedException(AUTH_USER_PASSWORD_WRONG);
    }
    await user.setPassword(dto.newPassword);
    await this.blogUserRepository.update(user);
    return { message: 'Password changed successfully' };
  }

  public async toggleSubscribe(subscriberId: string, dto: ToggleSubscribeDto): Promise<{ isSubscribed: boolean }> {
    const { publisherId } = dto;

    if (subscriberId === publisherId) {
      throw new BadRequestException('Cannot subscribe to yourself');
    }

    const subscriber = await this.blogUserRepository.findById(subscriberId);
    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }

    const publisher = await this.blogUserRepository.findById(publisherId);
    if (!publisher) {
      throw new NotFoundException('Publisher not found');
    }

    const isCurrentlySubscribed = subscriber.isSubscribedTo(publisherId);

    if (isCurrentlySubscribed) {
      await this.blogUserRepository.removeSubscription(subscriberId, publisherId);
      await this.blogUserRepository.updateSubscribersCount(publisherId, false);
      subscriber.removeSubscription(publisherId);
    } else {
      await this.blogUserRepository.addSubscription(subscriberId, publisherId);
      await this.blogUserRepository.updateSubscribersCount(publisherId, true);
      subscriber.addSubscription(publisherId);
    }

    return { isSubscribed: !isCurrentlySubscribed };
  }

  public async getSubscribers(publisherId: string) {
    return this.blogUserRepository.findSubscribersByPublisherId(publisherId);
  }
}
