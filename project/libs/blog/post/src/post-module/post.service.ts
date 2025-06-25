import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Post } from "@project/core";

import { PostRepository } from "./post.repository";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostListQueryDto } from "./dto/post-list-query.dto";
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
      ...dto,
      authorId: userId,
      tags: [...new Set(dto.tags)],
      publishedAt: new Date
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

    await this.postRepository.update(postEntity);
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

  public async find(query: PostListQueryDto) {
    return this.postRepository.find(query);
  }

  public async findPostsBySubscriptions(subscriptions: string[], query: PostListQueryDto) {
    return this.postRepository.findPostsBySubscriptions(subscriptions, query);
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
   repost.createdAt = new Date();
   repost.publishedAt = new Date();   

   const repostEntity = this.postFactory.create(repost);

   await this.postRepository.save(repostEntity);

   repostEntity.likesCount = 0;
   repostEntity.commentsCount = 0;

   return repostEntity;
  }
}
