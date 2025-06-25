import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApplicationServiceURL } from './app.config';

export interface NewPostNotifyDto {
  postId: string;
  authorId: string;
  authorFirstname: string;
  authorLastname: string;
  postType: string;
  postTitle: string;
  tags?: string[];
  subscriberEmails?: string[];
}

@Injectable()
export class NotifyService {
  constructor(private readonly httpService: HttpService) {}

  public async notifyNewPost(notifyData: NewPostNotifyDto) {
    try {
      await this.httpService.axiosRef.post(
        `${ApplicationServiceURL.Notification}/notify/new-post`,
        notifyData
      );
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }
} 