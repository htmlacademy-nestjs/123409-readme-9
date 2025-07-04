import { Controller, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostLikeService } from './post-likes.service';
import { CreatePostLikeDto } from './dto/create-post-like.dto';

@ApiTags('posts')
@Controller('posts/:postId/likes')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create new like' })
  @ApiResponse({
    status: 201,
    description: 'The like has been successfully created.'
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Like already exists.' })
  public async create(@Param('postId') postId: string, @Body() dto: CreatePostLikeDto) {
    await this.postLikeService.create(postId, dto.userId);
    return { message: 'Like created successfully' };
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete like' })
  @ApiResponse({
    status: 200,
    description: 'The like has been successfully deleted.'
  })
  @ApiResponse({ status: 404, description: 'Like not found.' })
  public async delete(@Param('postId') postId: string, @Body() dto: CreatePostLikeDto) {
    console.log('postId2', postId);
    await this.postLikeService.delete(postId, dto.userId);
    return { message: 'Like deleted successfully' };
  }
}
