import { HttpService } from '@nestjs/axios';
import { Body, Controller, Post, Req, UseFilters } from '@nestjs/common';
import type { Request } from 'express';

import { LoginUserDto, CreateUserDto, ChangePasswordDto } from '@project/feature-authentication';

import { ApplicationServiceURL } from './app.config';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';

@Controller('auth')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(
    private readonly httpService: HttpService
  ) {}

  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto) {
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/register`, createUserDto);
    return data;
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/login`, loginUserDto);
    return data;
  }

  @Post('refresh')
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/refresh`, null, {
      headers: {
        'Authorization': req.headers['authorization']
      }
    });

    return data;
  }

  @Post('check')
  public async checkToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/check`, {}, {
      headers: {
        'Authorization': req.headers['authorization']
      }
    });
    return data;
  }

  @Post('change-password')
  public async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/change-password`, dto, {
      headers: {
        'Authorization': req.headers['authorization']
      }
    });
    return data;
  }

  @Post(':id')
  public async show(@Req() req: Request) {
    const id = req.params.id;
    const { data } = await this.httpService.axiosRef.get(`${ApplicationServiceURL.Users}/${id}`, {
      headers: {
        'Authorization': req.headers['authorization']
      }
    });
    return data;
  }
}