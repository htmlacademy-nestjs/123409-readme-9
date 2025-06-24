import { Body, Controller, Post, UseFilters, UseGuards, UseInterceptors, Param, Get, Query, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { CreatePostDto } from '@project/post';
import { CreatePostCommentDto } from '../../../../libs/blog/post/src/post-comment-module/dto/create-post-comment.dto';
import { ApplicationServiceURL } from './app.config';
import { UpdatePostDto } from '../../../../libs/blog/post/src/post-module/dto/update-post.dto';

@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {

  constructor(
    private readonly httpService: HttpService,
  ) {}

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(UseInterceptors)
  @Post('/')
  public async create(@Body() dto: CreatePostDto, @Req() req: any) {
    const { authorization } = req.headers;
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/`,
      dto,
      { headers: { Authorization: authorization } }
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Post('update')
  public async updatePost(
    @Body() dto: UpdatePostDto,
    @Req() req: any
  ) {
    const { authorization } = req.headers;
    const { data } = await this.httpService.axiosRef.put(
      `${ApplicationServiceURL.Blog}/update`,
      dto,
      { headers: { Authorization: authorization } }
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

  @Get(':id')
  public async getPostById(@Param('id') id: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/${id}`
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Post('delete/:id')
  public async deletePost(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const { authorization } = req.headers;
    const { data } = await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Blog}/${id}`,
      { headers: { Authorization: authorization } }
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Post(':postId/comments/create')
  public async createComment(
    @Param('postId') postId: string,
    @Body() dto: CreatePostCommentDto,
    @Req() req: any
  ) {
    const { authorization } = req.headers;
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/${postId}/comments/create`,
      { ...dto, postId },
      { headers: { Authorization: authorization } }
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
}