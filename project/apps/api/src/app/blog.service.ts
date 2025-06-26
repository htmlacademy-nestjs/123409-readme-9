import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Request } from 'express';
import type { TokenPayload } from '@project/core';

import { CreatePostDto, UpdatePostDto, CreatePostCommentDto, CreatePostLikeDto, RepostPostDto } from '@project/post';
import { ApplicationServiceURL } from './app.config';
import { NotifyService } from './notify.service';
import { NewPostNotifyDto } from '@project/email-subscriber';

interface RequestWithUser extends Request {
  user?: TokenPayload;
}

@Injectable()
export class BlogService {
  constructor(
    private readonly httpService: HttpService,
    private readonly notifyService: NotifyService,
  ) {}

  async createPost(dto: CreatePostDto, req: RequestWithUser) {
    const { data: postData } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/create`,
      dto
    );

    const { data: authorData } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Users}/${dto.userId}`,
      {
        headers: {
          'Authorization': req.headers['authorization']
        }
      }
    );

    const { data: subscribersData } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Users}/subscribers/${dto.userId}`,
      {
        headers: {
          'Authorization': req.headers['authorization']
        }
      }
    );

    if (subscribersData && subscribersData.length > 0) {
      const subscriberEmails = subscribersData.map((subscriber: any) => subscriber.email);
      const postTitle = this.getPostTitle(dto.content, dto.type);

      const notifyData: NewPostNotifyDto = {
        postId: postData.id,
        authorId: dto.userId,
        authorFirstname: authorData.firstname,
        authorLastname: authorData.lastname,
        postType: dto.type,
        postTitle: postTitle,
        tags: dto.tags,
        subscriberEmails: subscriberEmails,
      };

      await this.notifyService.notifyNewPost(notifyData);
    }

    return postData;
  }

  async updatePost(dto: UpdatePostDto) {
    const { data } = await this.httpService.axiosRef.put(
      `${ApplicationServiceURL.Blog}/update`,
      dto
    );
    return data;
  }

  async getAllPosts(query: any) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/`,
      { params: query }
    );
    return data;
  }

  async getSubscribedPosts(query: any, req: RequestWithUser) {
    if (!req.user) {
      throw new Error('User not found in request');
    }
    
    const { data: userData } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Users}/${req.user.sub}`,
      {
        headers: {
          'Authorization': req.headers['authorization']
        }
      }
    );
    
    const subscriptions = userData.subscriptions || [];
    
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/subscriptions`,
      { 
        subscriptions,
        ...query
      }
    );
    return data;
  }

  async getPostById(id: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/${id}`
    );
    return data;
  }

  async deletePost(id: string) {
    const { data } = await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Blog}/${id}`
    );
    return data;
  }

  async repostPost(postId: string, dto: RepostPostDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/${postId}/repost`,
      dto
    );
    return data;
  }

  async createComment(postId: string, dto: CreatePostCommentDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/${postId}/comments/create`,
      { ...dto, postId }
    );
    return data;
  }

  async getComments(postId: string, query: any) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/${postId}/comments`,
      { params: query }
    );
    return data;
  }

  async getCommentById(postId: string, id: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/${postId}/comments/${id}`
    );
    return data;
  }

  async createLike(postId: string, dto: CreatePostLikeDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/${postId}/likes/create`,
      dto
    );
    return data;
  }

  async deleteLike(postId: string) {
    const { data } = await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Blog}/${postId}/likes/delete`,
    );
    return data;
  }

  private getPostTitle(content: any, type: string): string {
    switch (type) {
      case 'text':
        return content.title || content.announcement || 'Новый текстовый пост';
      case 'video':
        return content.title || 'Новый видео пост';
      case 'photo':
        return content.title || 'Новый фото пост';
      case 'quote':
        return content.quote || 'Новый пост с цитатой';
      case 'link':
        return content.description || 'Новый пост со ссылкой';
      default:
        return 'Новый пост';
    }
  }
} 