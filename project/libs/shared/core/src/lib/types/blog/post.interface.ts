import { PostType, PostStatus } from './post-type.enum';
import { PostContent } from './post-content.interface';


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
  content: PostContent;
  tags?: string[];
  likesCount?: number;
  commentsCount?: number;
}