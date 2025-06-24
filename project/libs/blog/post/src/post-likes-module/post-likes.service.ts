import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PostLike } from "@project/core";

import { PostLikeFactory } from "./post-likes.factory";
import { PostLikeRepository } from "./post-likes.repository";
import { POST_LIKE_NOT_FOUND, POST_LIKE_ALREADY_EXISTS } from "./post-likes.constants";

@Injectable()
export class PostLikeService {
  constructor(
    private readonly postLikeRepository: PostLikeRepository,
    private readonly postLikeFactory: PostLikeFactory
  ) {}

  public async create(postId: string, userId: string) {
    // Проверяем, не существует ли уже лайк от этого пользователя
    const existingLike = await this.postLikeRepository.findByUserAndPost(userId, postId);
    
    if (existingLike) {
      throw new ConflictException(POST_LIKE_ALREADY_EXISTS);
    }

    const postLike: PostLike = {
      postId,
      userId,
      createdAt: new Date(),
    };

    const postLikeEntity = this.postLikeFactory.create(postLike);
    await this.postLikeRepository.save(postLikeEntity);
    
    return postLikeEntity;
  }

  public async delete(postId: string, userId: string) {
    const postLike = await this.postLikeRepository.findByUserAndPost(userId, postId);

    if (!postLike) {
      throw new NotFoundException(POST_LIKE_NOT_FOUND);
    }

    await this.postLikeRepository.deleteByUserAndPost(userId, postId);
  }

  public async isLikedByUser(postId: string, userId: string): Promise<boolean> {
    const like = await this.postLikeRepository.findByUserAndPost(userId, postId);
    return !!like;
  }

  public async findByUserId(userId: string) {
    const postLikes = await this.postLikeRepository.findByUserId(userId);
    return postLikes;
  }
} 