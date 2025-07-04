import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PostComment } from "@project/core";

import { PostCommentFactory } from "./post-comment.factory";
import { PostCommentListQuery, PostCommentRepository } from "./post-comment.repository";
import { CreatePostCommentDto } from "./dto/create-post-comment.dto";
import { postCommentErrors } from "./post-comment.constants";

@Injectable()
export class PostCommentService {
  constructor(
    private readonly postCommentRepository: PostCommentRepository,
    private readonly postCommentFactory: PostCommentFactory
  ) {}

  public async create(dto: CreatePostCommentDto, userId: string) {
    const postComment: PostComment = {
      content: dto.content,
      postId: dto.postId,
      authorId: userId,
      createdAt: new Date(),
    };

    const postCommentEntity = this.postCommentFactory.create(postComment);

    await this.postCommentRepository.save(postCommentEntity);
    return postCommentEntity;
  }

  public async delete(id: string) {
    const postComment = await this.postCommentRepository.findById(id);

    if (!postComment) {
      throw new NotFoundException(postCommentErrors.NOT_FOUND);
    }

    await this.postCommentRepository.deleteById(id);
  }


  public async findById(id: string) {
    const postComment = await this.postCommentRepository.findById(id);

    if (!postComment) {
      throw new NotFoundException(postCommentErrors.NOT_FOUND);
    }

    return postComment;
  }

  public async findByPostId(postId: string, query: PostCommentListQuery) {
    const postComments = await this.postCommentRepository.findByPostId(postId, query);
    return postComments;
  }
}
