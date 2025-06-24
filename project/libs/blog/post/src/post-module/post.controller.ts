import { Controller, Post, Body, Param, Get, Put, Delete, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RepostPostDto } from './dto/repost-post.dto';
import { PostListQueryDto } from './dto/post-list-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PostRdo } from './rdo/post.rdo';
import { BlogPostWithPaginationRdo } from './rdo/post-with-pagination.dto';
import { fillDto } from '@project/helpers';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
    type: CreatePostDto
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  public async create(@Body() dto: CreatePostDto) {
    const newPost = await this.postService.create(dto, dto.userId);
    return fillDto(PostRdo, newPost.toPOJO());
  }

  @Put('update')
  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
    type: UpdatePostDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async update(@Body() dto: UpdatePostDto) {
    const updatedPost = await this.postService.update(dto, dto.userId);
    return fillDto(PostRdo, updatedPost.toPOJO());
  }

  @Post(':id/repost')
  @ApiOperation({ summary: 'Repost a post' })
  @ApiParam({ name: 'id', description: 'Post ID to repost' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully reposted.',
    type: PostRdo
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  public async repost(@Param('id') id: string, @Body() dto: RepostPostDto) {
    const repostedPost = await this.postService.repost(id, dto.userId);
    return fillDto(PostRdo, repostedPost.toPOJO());
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    description: 'The posts have been successfully found.',
    type: UpdatePostDto
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  public async index(@Query() query: PostListQueryDto) {
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'The post has been successfully deleted.' })
  public async delete(@Param('id') id: string, @Body() body: any) {
    await this.postService.delete(id, body.userId);
  }
}
