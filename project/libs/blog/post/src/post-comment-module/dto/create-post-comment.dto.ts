import { ApiProperty } from "@nestjs/swagger";

export class CreatePostCommentDto {
    @ApiProperty({
        description: 'Comment content',
        example: 'This is a comment'
    })
    content: string;

    @ApiProperty({
        description: 'Post ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    postId: string;
} 