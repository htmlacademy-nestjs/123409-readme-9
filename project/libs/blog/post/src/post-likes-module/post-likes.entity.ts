import { PostLike, StorableEntity } from "@project/core";
import { Entity } from "@project/core";

export class PostLikeEntity extends Entity implements StorableEntity<PostLike> {
    public userId: string;
    public postId: string;
    public createdAt: Date;

    constructor(postLike?: PostLike) {
        super();
        this.populate(postLike);
    }

    public populate(postLike?: PostLike): void {
        if (!postLike) {
            return;
        }

        if(postLike.id) {
            this.id = postLike.id;
        }
        this.userId = postLike.userId;
        this.postId = postLike.postId;
        this.createdAt = postLike.createdAt;
    }

    public toPOJO(): PostLike {
        const pojo: PostLike = {    
            userId: this.userId,
            postId: this.postId,
            createdAt: this.createdAt,
        };

        if(this.id) {
            pojo.id = this.id;
        }

        return pojo;
    }    
} 