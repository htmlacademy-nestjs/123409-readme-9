import { Controller, Post, Body, Param, Get, Put, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '@project/feature-authentication';
import type { RequestWithTokenPayload } from '@project/feature-authentication';
import type { PostListQuery } from './post.repository';
import { PostRdo } from './rdo/post.rdo';
import { BlogPostWithPaginationRdo } from './rdo/post-with-pagination.dto';
import { fillDto } from '@project/helpers';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
    type: CreatePostDto
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  public async create(@Req() { user: payload }: RequestWithTokenPayload, @Body() dto: CreatePostDto) {
    if (!payload) {
      throw new Error('User not found in request');
    }
    const newPost = await this.postService.create(dto, payload.sub);
    return fillDto(PostRdo, newPost.toPOJO());
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
    type: UpdatePostDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async update(@Req() { user: payload }: RequestWithTokenPayload, @Body() dto: UpdatePostDto) {
    if (!payload) {
      throw new Error('User not found in request');
    }
    const updatedPost = await this.postService.update(dto, payload.sub);
    return fillDto(PostRdo, updatedPost.toPOJO());
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    description: 'The posts have been successfully found.',
    type: UpdatePostDto
  })
  public async index(@Query() query: PostListQuery) {
    const postsWithPagination = await this.postService.find(query);
    return fillDto(BlogPostWithPaginationRdo, {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map(post => fillDto(PostRdo, post.toPOJO()))
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by id' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully found.',
    type: UpdatePostDto
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  public async show(@Param('id') id: string) {
    const existPost = await this.postService.findById(id);
    return fillDto(PostRdo, existPost.toPOJO());
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'The post has been successfully deleted.' })
  public async delete(@Req() { user: payload }: RequestWithTokenPayload, @Param('id') id: string) {
    if (!payload) {
      throw new Error('User not found in request');
    }
    await this.postService.delete(id, payload.sub);
  }
}
