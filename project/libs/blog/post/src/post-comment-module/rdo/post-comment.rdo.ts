import { Expose } from 'class-transformer';

export class PostCommentRdo {
  @Expose()
  public id: string;

  @Expose()
  public content: string;

  @Expose()
  public postId: string;

  @Expose()
  public authorId: string;

  @Expose()
  public createdAt: Date;
} 