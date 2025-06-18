import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TEST_USER_ID } from '@project/core';
import { PostCommentService } from './post-comment.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';

@ApiTags('posts')
@Controller('posts/:postId/comments')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}
  

  @Post('create')
  @ApiOperation({ summary: 'Create new comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
    type: CreatePostCommentDto
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  public async create(@Body() dto: CreatePostCommentDto) {
    const newPostComment = await this.postCommentService.create(dto, TEST_USER_ID);
    return newPostComment.toPOJO();
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({
    status: 200,
    description: 'The comments have been successfully found.',
    type: CreatePostCommentDto
  })
  public async find(@Param('postId') postId: string) {
    const postComments = await this.postCommentService.findByPostId(postId);
    return postComments.map(postComment => postComment.toPOJO());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by id' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully found.',
    type: CreatePostCommentDto
  })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  public async findById(@Param('id') id: string) {
    const postComment = await this.postCommentService.findById(id);
    return postComment.toPOJO();
  }
}
