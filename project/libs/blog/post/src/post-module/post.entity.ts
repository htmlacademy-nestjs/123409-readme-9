import { Entity, StorableEntity, Post, PostStatus, PostType, PhotoPostContent, QuotePostContent, TextPostContent, VideoPostContent, LinkPostContent } from "@project/core";

export class PostEntity extends Entity implements StorableEntity<Post> {
  public type: PostType;
  public status: PostStatus;
  public authorId: string;
  public originalAuthorId?: string;
  public originalPostId?: string;
  public isRepost: boolean;
  public createdAt: Date;
  public publishedAt: Date;
  public content: VideoPostContent | TextPostContent | QuotePostContent | PhotoPostContent | LinkPostContent;
  public tags: string[];
  public likesCount?: number;
  public commentsCount?: number;
  constructor(post?: Post) {
    super();
    this.populate(post);
  }

  public populate(post?: Post): void {
    if (!post) {
      return;
    }

    if (post.id) {
      this.id = post.id;
    }
    this.type = post.type;
    this.status = post.status;
    this.authorId = post.authorId;
    this.originalAuthorId = post.originalAuthorId;
    this.originalPostId = post.originalPostId;
    this.isRepost = post.isRepost;
    this.createdAt = post.createdAt;
    this.publishedAt = post.publishedAt;
    this.content = post.content;
    this.tags = post.tags ?? [];
    
    if (post.likesCount !== undefined) {
      this.likesCount = post.likesCount;
    }
    
    if (post.commentsCount !== undefined) {
      this.commentsCount = post.commentsCount;
    }
  }

  public toPOJO(): Post {
    const pojo: Post = {
      type: this.type,
      status: this.status,
      authorId: this.authorId,
      originalAuthorId: this.originalAuthorId,
      originalPostId: this.originalPostId,
      isRepost: this.isRepost,
      createdAt: this.createdAt,
      publishedAt: this.publishedAt,
      content: this.content,
      tags: this.tags,
    };

    if (this.id) {
      pojo.id = this.id;
    }

    if (this.likesCount !== undefined) {
      pojo.likesCount = this.likesCount;
    }

    if (this.commentsCount !== undefined) {
      pojo.commentsCount = this.commentsCount;
    }

    return pojo;
  }
}
