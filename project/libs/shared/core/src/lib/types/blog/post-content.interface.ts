export interface BasePostContent {
  tags?: string[];
}

export interface VideoPostContent extends BasePostContent {
  title: string;
  videoUrl: string;
}

export interface TextPostContent extends BasePostContent {
  title: string;
  announcement: string;
  content: string;
}

export interface QuotePostContent extends BasePostContent {
  quote: string;
  author: string;
}

export interface PhotoPostContent extends BasePostContent {
  photo: string;
}

export interface LinkPostContent extends BasePostContent {
  url: string;
  description?: string;
} 

export type PostContent = VideoPostContent | TextPostContent | QuotePostContent | PhotoPostContent | LinkPostContent;