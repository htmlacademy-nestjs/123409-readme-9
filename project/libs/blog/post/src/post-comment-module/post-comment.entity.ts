import { PostComment, StorableEntity } from "@project/core";

import { Entity } from "@project/core";

export class PostCommentEntity extends Entity implements StorableEntity<PostComment> {
    public content: string;
    public postId: string;
    public authorId: string;
    public createdAt: Date;

    constructor(postComment?: PostComment) {
        super();
        this.populate(postComment);
    }

    public populate(postComment?: PostComment): void {
        if (!postComment) {
            return;
        }

        this.id = postComment.id ?? '';
        this.content = postComment.content;
        this.postId = postComment.postId;
        this.authorId = postComment.authorId;
        this.createdAt = postComment.createdAt;
    }

    public toPOJO(): PostComment {
        return {
            id: this.id,
            content: this.content,
            postId: this.postId,
            authorId: this.authorId,
            createdAt: this.createdAt,
        };
    }    
} 
