export interface PostComment {
    id?: string;
    content: string;
    postId: string;
    authorId: string;
    createdAt: Date;
}