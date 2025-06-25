import { Body, Controller, Post, UseFilters, UseGuards, UseInterceptors, Param, Get, Query, Logger, Delete, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Request } from 'express';
import type { TokenPayload } from '@project/core';

import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { CreatePostDto, CreatePostCommentDto, UpdatePostDto, CreatePostLikeDto, RepostPostDto } from '@project/post';
import { ApplicationServiceURL } from './app.config';
import { InjectUserIdInterceptor } from '@project/interceptors';

interface RequestWithUser extends Request {
  user?: TokenPayload;
}

@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {

  constructor(
    private readonly httpService: HttpService,
  ) {}

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post('/')
  public async create(@Body() dto: CreatePostDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/`,
      dto
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post('update')
  public async updatePost(
    @Body() dto: UpdatePostDto
  ) {
    const { data } = await this.httpService.axiosRef.put(
      `${ApplicationServiceURL.Blog}/update`,
      dto
    );
    return data;
  }

  @Get('/')
  public async getAllPosts(@Query() query: any) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/`,
      { params: query }
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Get('subscriptions')
  public async getSubscribedPosts(@Query() query: any, @Req() req: RequestWithUser) {
    if (!req.user) {
      throw new Error('User not found in request');
    }
    
    const { data: userData } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Users}/${req.user.sub}`,
      {
        headers: {
          'Authorization': req.headers['authorization']
        }
      }
    );
    
    const subscriptions = userData.subscriptions || [];
    
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/subscriptions`,
      { 
        subscriptions,
        ...query
      }
    );
    return data;
  }

  @Get(':id')
  public async getPostById(@Param('id') id: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/${id}`
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post('delete/:id')
  public async deletePost(
    @Param('id') id: string
  ) {
    const { data } = await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Blog}/${id}`
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post(':postId/repost')
  public async repostPost(
    @Param('postId') postId: string,
    @Body() dto: RepostPostDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/${postId}/repost`,
      dto
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post(':postId/comments/create')
  public async createComment(
    @Param('postId') postId: string,
    @Body() dto: CreatePostCommentDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/${postId}/comments/create`,
      { ...dto, postId }
    );
    return data;
  }

  @Get(':postId/comments')
  public async getComments(
    @Param('postId') postId: string,
    @Query() query: any
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/${postId}/comments`,
      { params: query }
    );
    return data;
  }

  @Get(':postId/comments/:id')
  public async getCommentById(
    @Param('postId') postId: string,
    @Param('id') id: string
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/${postId}/comments/${id}`
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post(':postId/likes/create')
  public async createLike(
    @Param('postId') postId: string,
    @Body() dto: CreatePostLikeDto
  ) {
    console.log('postId2', postId);
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/${postId}/likes/create`,
      dto
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Delete(':postId/likes/delete')
  public async deleteLike(
    @Param('postId') postId: string,
  ) {
    const { data } = await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Blog}/${postId}/likes/delete`,
    );
    return data;
  }
}
