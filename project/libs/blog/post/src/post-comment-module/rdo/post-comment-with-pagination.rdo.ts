import { Expose } from 'class-transformer';
import { PostCommentRdo } from './post-comment.rdo';

export class PostCommentWithPaginationRdo {
  @Expose()
  public entities: PostCommentRdo[];

  @Expose()
  public totalPages: number;

  @Expose()
  public totalItems: number;

  @Expose()
  public currentPage: number;

  @Expose()
  public itemsPerPage: number;
} 