import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostCommentService } from './post-comment.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import type { PostCommentListQuery } from './post-comment.repository';
import { PostCommentRdo } from './rdo/post-comment.rdo';
import { PostCommentWithPaginationRdo } from './rdo/post-comment-with-pagination.rdo';
import { fillDto } from '@project/helpers';

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
    const newPostComment = await this.postCommentService.create(dto, dto.userId);
    return fillDto(PostCommentRdo, newPostComment.toPOJO());
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({
    status: 200,
    description: 'The comments have been successfully found.',
    type: CreatePostCommentDto
  })
  public async find(@Param('postId') postId: string, @Query() query: PostCommentListQuery) {
    const postComments = await this.postCommentService.findByPostId(postId, query);
    return fillDto(PostCommentWithPaginationRdo, {
      ...postComments,
      entities: postComments.entities.map(postComment => fillDto(PostCommentRdo, postComment.toPOJO()))
    });
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
    return fillDto(PostCommentRdo, postComment.toPOJO());
  }
}
