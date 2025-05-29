import { genSalt, hash, compare } from 'bcrypt';
import { Entity, StorableEntity, Post, PostStatus, PostType, PhotoPostContent, QuotePostContent, TextPostContent, VideoPostContent, LinkPostContent, AuthUser } from "@project/core";

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
  constructor(post?: Post) {
    super();
    this.populate(post);
  }

  public populate(post?: Post): void {
    if (!post) {
      return;
    }

    this.id = post.id ?? '';
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
  }

  public toPOJO(): Post {
    return {
      id: this.id,
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
  }
}
