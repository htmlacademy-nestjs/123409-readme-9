import { PostType, PostStatus } from './post-type.enum';
import { VideoPostContent, TextPostContent, QuotePostContent, PhotoPostContent, LinkPostContent } from './post-content.interface';

export interface Post {
  id?: string;
  type: PostType;
  status: PostStatus;
  authorId: string;
  originalAuthorId?: string;
  originalPostId?: string;
  isRepost: boolean;
  createdAt: Date;
  publishedAt: Date;
  content: VideoPostContent | TextPostContent | QuotePostContent | PhotoPostContent | LinkPostContent;
  tags?: string[];
}