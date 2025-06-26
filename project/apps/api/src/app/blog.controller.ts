import { Body, Controller, Post, UseFilters, UseGuards, UseInterceptors, Param, Get, Query, Delete, Req } from '@nestjs/common';
import type { Request } from 'express';
import type { TokenPayload } from '@project/core';

import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { CreatePostDto, CreatePostCommentDto, UpdatePostDto, CreatePostLikeDto, RepostPostDto } from '@project/post';
import { InjectUserIdInterceptor } from '@project/interceptors';
import { BlogService } from './blog.service';

interface RequestWithUser extends Request {
  user?: TokenPayload;
}

@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {

  constructor(
    private readonly blogService: BlogService,
  ) {}

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post('create')
  public async create(@Body() dto: CreatePostDto, @Req() req: RequestWithUser) {
    return this.blogService.createPost(dto, req);
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post('update')
  public async updatePost(@Body() dto: UpdatePostDto) {
    return this.blogService.updatePost(dto);
  }

  @Get('/')
  public async getAllPosts(@Query() query: any) {
    return this.blogService.getAllPosts(query);
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Get('subscriptions')
  public async getSubscribedPosts(@Query() query: any, @Req() req: RequestWithUser) {
    return this.blogService.getSubscribedPosts(query, req);
  }

  @Get(':id')
  public async getPostById(@Param('id') id: string) {
    return this.blogService.getPostById(id);
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post('delete/:id')
  public async deletePost(@Param('id') id: string) {
    return this.blogService.deletePost(id);
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post(':postId/repost')
  public async repostPost(
    @Param('postId') postId: string,
    @Body() dto: RepostPostDto
  ) {
    return this.blogService.repostPost(postId, dto);
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post(':postId/comments/create')
  public async createComment(
    @Param('postId') postId: string,
    @Body() dto: CreatePostCommentDto
  ) {
    return this.blogService.createComment(postId, dto);
  }

  @Get(':postId/comments')
  public async getComments(
    @Param('postId') postId: string,
    @Query() query: any
  ) {
    return this.blogService.getComments(postId, query);
  }

  @Get(':postId/comments/:id')
  public async getCommentById(
    @Param('postId') postId: string,
    @Param('id') id: string
  ) {
    return this.blogService.getCommentById(postId, id);
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post(':postId/likes/create')
  public async createLike(
    @Param('postId') postId: string,
    @Body() dto: CreatePostLikeDto
  ) {
    return this.blogService.createLike(postId, dto);
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Delete(':postId/likes/delete')
  public async deleteLike(@Param('postId') postId: string) {
    return this.blogService.deleteLike(postId);
  }
}
