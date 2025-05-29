import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TEST_USER_ID } from '@project/core';
import { PostCommentService } from './post-comment.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';

@ApiTags('post-comment')
@Controller('post-comment')
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
