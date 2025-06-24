import { Controller, Post, Delete, Param, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostLikeService } from './post-likes.service';
import { CreatePostLikeDto } from './dto/create-post-like.dto';
import { UserLikesRdo } from './rdo/user-likes.rdo';
import { fillDto } from '@project/helpers';

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
    await this.postLikeService.delete(postId, dto.userId);
    return { message: 'Like deleted successfully' };
  }

  @Get('/')
  @ApiOperation({ summary: 'Get likes' })
  @ApiResponse({
    status: 200,
    description: 'The likes for current user.',
  })
  public async getLikes(@Body() body: { userId: string }) {
    const likes = await this.postLikeService.findByUserId(body.userId);
    return likes.map(like => fillDto(UserLikesRdo, like.toPOJO()));
  }
}
