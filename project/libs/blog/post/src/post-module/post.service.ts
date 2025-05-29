import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Post } from "@project/core";

import { PostRepository } from "./post.repository";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostFactory } from "./post.factory";
import { UpdatePostDto } from "./dto/update-post.dto";
import { POST_NOT_FOUND } from "./post.constants";

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postFactory: PostFactory
  ) {}

  public async create(dto: CreatePostDto, userId: string) {
    const post: Post = {
      type: dto.type,
      status: dto.status,
      authorId: userId,
      originalAuthorId: dto.originalAuthorId,
      originalPostId: dto.originalPostId,
      isRepost: dto.isRepost,
      createdAt: dto.createdAt,
      publishedAt: dto.publishedAt,
      content: dto.content,
      tags: [...new Set(dto.tags)],
    };

    const postEntity = this.postFactory.create(post);

    await this.postRepository.save(postEntity);
    return postEntity;
  }

  public async update(dto: UpdatePostDto, userId: string) {
    const { id } = dto;

    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new NotFoundException(POST_NOT_FOUND);
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException();
    }

    post.type = dto.type;
    post.status = dto.status;
    post.originalAuthorId = dto.originalAuthorId;
    post.originalPostId = dto.originalPostId;
    post.isRepost = dto.isRepost;
    post.createdAt = dto.createdAt;
    post.publishedAt = dto.publishedAt;
    post.content = dto.content;
    post.tags = [...new Set(dto.tags)];

    const postEntity = this.postFactory.create(post);

    await this.postRepository.save(postEntity);
    return postEntity;
  }

  public async delete(id: string, userId: string) {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new NotFoundException(POST_NOT_FOUND);
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException();
    }

    await this.postRepository.deleteById(id);
  }

  public async findById(id: string) {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new NotFoundException(POST_NOT_FOUND);
    }

    return post;
  }

  public async repost(id: string, userId: string) {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new NotFoundException(POST_NOT_FOUND);
    }

   const repost = post.toPOJO();

   repost.authorId = userId;
   repost.originalAuthorId = post.authorId;
   repost.originalPostId = post.id;
   repost.isRepost = true;

   const repostEntity = this.postFactory.create(repost);

   await this.postRepository.save(repostEntity);
   return repostEntity;
  }
}
